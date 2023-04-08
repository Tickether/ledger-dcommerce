
import { useContractRead } from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import { CartProps } from '../atom/cartState';




const CartComponent = ({ product, quantity, price } : CartProps) => {

    console.log(product, quantity, price)

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
    //const latestPrice = (getLatestPrice.toString())
    //const etherPrice = ethers.utils.formatEther(latestPrice)

    return (
        <div className="cart">
            <span>{product.title}</span>
            <span>{quantity}</span>
            <span>{quantity * Number(getLatestPrice)}</span>
        </div>
    );
}

export default CartComponent;