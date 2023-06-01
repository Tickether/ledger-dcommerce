import styles from '../styles/Cart.module.css'
import { useContractRead } from 'wagmi';
import { BigNumber, ethers } from 'ethers';
import { CartProps } from '../atom/cartState';




const CartComponent = ({ product, quantity, price } : CartProps) => {

    console.log(product, quantity, price)

    const contractReadFee = useContractRead({
        address: "0x1F005f90d9723bc5b4Df5CF4E7c5A5BEaC633F99",
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
    const latestPrice = (getLatestPrice._hex)
    const etherPrice = ethers.utils.formatEther(latestPrice)

    /*
    const handleDecrement = () => {
        if (quantity <= 1 ) return;
        setClaimAmount(quantity - 1);
    };

    const handleIncrement = () => {
        if (quantity >= 25 ) return;
        setClaimAmount(quantity + 1);
    };
    */

    return (
        <div className={styles.cartItem}>
            <div className={styles.cartItemWrapper}>
                <div className={styles.cartItemTop}>
                    <span>
                        <img src={product.media[0].gateway} className={styles.cartItemImg} alt="" />
                    </span>
                    <span className={styles.cartItemTitle}>{product.title}</span>
                    <span className={styles.cartItemTotal}>{quantity * Number(etherPrice)}</span>
                </div>
                <div className={styles.carItemButtons}>
                    <button /*onClick={handleDecrement}*/>-</button>
                    <input 
                        readOnly
                        type='number' 
                        value={quantity}
                    />
                    <button /*onClick={handleIncrement}*/>+</button>
                </div>
            </div>  
        </div>

    );
}

export default CartComponent;