import Link from "next/link";
//import Image from 'next/image';
import { Attributes, Product } from "../models/models";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { BigNumber, ethers } from 'ethers';
import { useRecoilState } from 'recoil'
import { cartState } from "../atom/cartState";
import { useToasts } from 'react-toast-notifications';


interface ProductProps {
    product: Product
}







const ProductComponent = ({product}: ProductProps) => {

    

    const [cartItem, setCartItem] = useRecoilState(cartState)

    const {address, isConnected} = useAccount()

    const { addToast } = useToasts();

    const contractReadFee = useContractRead({
        address: "0xa2F704361FE9C37A824D704DAaB18f1b7949e8A2",
        abi: [
            {
              name: 'getLatestPrice',
              inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
              outputs: [{ internalType: "int256", name: "", type: "int256" }],
              stateMutability: 'view',
              type: 'function',
            },
            
          ],
        functionName: 'getLatestPrice',
        args: [BigNumber.from(product.tokenId)],
        chainId: 11155111,
    })

    const getLatestPrice  = (contractReadFee.data!)
    const latestPrice = (getLatestPrice.toString())
    const etherPrice = ethers.utils.formatEther(latestPrice)

    console.log((getLatestPrice))

    const  contractWrite = useContractWrite({
        mode: 'recklesslyUnprepared',
        address: "0xa2F704361FE9C37A824D704DAaB18f1b7949e8A2",
        abi: [
            {
              name: 'buy',
              inputs: [ {internalType: "address", name: "to", type: "address"}, {internalType: "uint256", name: "id", type: "uint256"}, {internalType: "uint256", name: "amount", type: "uint256" } ],
              outputs: [],
              stateMutability: 'payable',
              type: 'function',
            },
          ],
        functionName: "buy",
        args: [ (address!), (BigNumber.from(product.tokenId)), (BigNumber.from(1))],
        overrides: {
            value: getLatestPrice,
        },
        chainId: 11155111,
    })

    const handleBuy = async () => {
        try {
          await contractWrite.writeAsync?.()
        } catch (err) {
          console.log(err)
        }
    }

    const handleCartAdd = async () => {
        try {
            if (cartItem.findIndex(cart => cart.product.tokenId ===product.tokenId) === -1) {
                setCartItem(prevState => [...prevState, { product, quantity: 1, price: latestPrice }])
                addToast('Carti!!!', { appearance: 'success' });
            } 
            /*
            else {
                
                setCartItem(prevState => {
                    return prevState.map((item) =>{
                        return item.product.tokenId === product.tokenId ? {...item.product, quantity: (item.quantity + 1) } : item
                    })
                })
                addToast(`added another ${product.title} to Carti!!!`, { appearance: 'success' });
            }
          */
        } catch (err) {
          console.log(err)
        }
    }


    return (
        <div className="product">
            <div className="productContainer">
                <Link href={`/${product.title}`}>
                    <img 
                        src={product.media[0].gateway} 
                        alt="" 
                        className="rentalImg" 
                    />
                </Link>
                <div className="productDetails">
                    <div className="productTitle">
                        <h2>{product.title}</h2>
                    </div>
                    <div>
                        <p>eth:{etherPrice}</p>
                    </div>
                    <div className="productDesc">
                        <p>{product.description}</p>
                    </div>
                    <div className="productAttr">
                        {(product.rawMetadata.attributes).map((attributes: Attributes)=>(
                            <div key={attributes.trait_type}>
                            {attributes.trait_type}

                            </div>
                        ))}
                    </div>
                    <div>
                        <button disabled={!isConnected} onClick={handleBuy}> Buy </button>
                        <button onClick={handleCartAdd}> Add to Cart </button> 
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductComponent;