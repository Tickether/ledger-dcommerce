import Link from "next/link";
//import Image from 'next/image';
import { Attributes, Product } from "../models/models";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { BigNumber, ethers } from 'ethers';


interface ProductProps {
    product: Product
}





const ProductComponent = ({product}: ProductProps) => {

    const {address, isConnected} = useAccount()
    //const wallet_ = wallet.address

    const contractReadRentFeeNative = useContractRead({
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

    const getLatestPrice  = (contractReadRentFeeNative.data?._hex)
    const latestPrice = parseInt(getLatestPrice!, 16)
    const etherPrice = ethers.utils.formatEther(latestPrice.toString())

    console.log((etherPrice))

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
        args: [ (address!) /*('0xa2F704361FE9C37A824D704DAaB18f1b7949e8A2')*/, (BigNumber.from(product.tokenId)), (BigNumber.from(1))],
        overrides: {
            value: ethers.utils.parseEther((etherPrice).toString()),
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
                        <button disabled={!isConnected} onClick={handleBuy}>Buy</button>
                        <button>Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductComponent;