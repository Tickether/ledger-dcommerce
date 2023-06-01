import styles from '../styles/Claim.module.css';
import { BigNumber, /*ethers*/ } from 'ethers';
import { Product } from '../models/models';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useEffect, useRef, useState } from 'react';
import ShipOutComponent from './ShipOutComponent';
import { isEqual } from 'lodash';


interface ProductProps {
    product: Product
    Order: (order : any) => void;
}



const ClaimComponent = ({ product, Order} : ProductProps) => {

    const {address, isConnected} = useAccount()

    console.log(product)

    const [balance, setBalance] = useState<number>()
    const [claimed, setClaimed] = useState<number>()
    const [claimAmount, setClaimAmount] = useState(0);
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [order, setOrder] = useState<any>();

    console.log(order)
    
    const contractReadBalance = useContractRead({
        address: "0x1F005f90d9723bc5b4Df5CF4E7c5A5BEaC633F99",
        abi: [
            {
              name: 'balanceOf',
              inputs: [{internalType: "address", name: "account", type: "address"}, { internalType: "uint256", name: "id", type: "uint256" }],
              outputs: [{ internalType: "int256", name: "", type: "int256" }],
              stateMutability: 'view',
              type: 'function',
            },
        ],
        functionName: 'balanceOf',
        args: [ (address!), BigNumber.from(product.tokenId) ],
        watch: true,
        chainId: 11155111,
    })
    console.log(contractReadBalance.data)

    const getBalance = contractReadBalance?.data!
    
    
    const contractReadClaimed = useContractRead({
        address: "0x1F005f90d9723bc5b4Df5CF4E7c5A5BEaC633F99",
        abi: [
            {
              name: 'claimed',
              inputs: [{ internalType: "uint256", name: "", type: "uint256" }, {internalType: "address", name: "", type: "address"}],
              outputs: [{ internalType: "int256", name: "", type: "int256" }],
              stateMutability: 'view',
              type: 'function',
            },
        ],
        functionName: 'claimed',
        args: [BigNumber.from(product.tokenId), (address!)],
        watch: true,
        chainId: 11155111,
    })
    console.log(contractReadClaimed.data)
    const getClaimed = contractReadClaimed?.data!
    

    useEffect(() => {
        // prevent site breaking effect
        if(getClaimed && getBalance){
            const balanceHex = getBalance._hex!
            const balanceInt = parseInt(balanceHex, 16)    
            console.log(balanceInt)
            setBalance(balanceInt)

            //
            const claimedHex = getClaimed._hex
            const claimedInt = parseInt(claimedHex, 16)    
            console.log(claimedInt)
            setClaimed(claimedInt)
        }

        const orderInfo ={ 
            name: product.title,
            token: product.tokenId,
            claim: claimAmount,
            remain: balance!- claimed!,

        }
        setOrder(orderInfo)
        //Order(orderInfo)
        

    }, [getClaimed, getBalance, product, claimAmount, balance, claimed]);

    const prevOrderRef = useRef(order);

    /*
    function compareOrders(orderA : any, orderB: any) {
        // Compare the relevant properties of the orders
        if (
          orderA.name === orderB.name &&
          orderA.token === orderB.token &&
          orderA.claim === orderB.claim
        ) {
          return true; // Orders are equal
        }
      
        return false; // Orders are different
    }
    */

    useEffect(() => {
        if (order && !isEqual(order, prevOrderRef.current)) {
            Order(order)
            prevOrderRef.current = order;
        }
        ; // Notify the parent component about the updated order
    }, [order, Order]);



      
    const handleDecrement = () => {
            if (claimAmount <= 0 ) return;
            setClaimAmount(claimAmount - 1);
        };

    const handleIncrement = () => {
        if (claimAmount >= balance! ) return;
        setClaimAmount(claimAmount + 1);
    };
    
    



    return (
        <div className={styles.claimItem}>  
            {
                !isConnected
                ? <p>connect your wallet Foo</p>
                : 
                <div className={styles.claimItemWrapper}>
                    <div className={styles.claimItemTop}>
                        <span>
                            <img src={product.media[0].gateway} className={styles.claimItemImg} alt="" />
                        </span>
                        <span className={styles.claimItemTitle}>{product.title}</span>
                        <span className={styles.claimItemQuantity}>{balance} Owned</span>
                        <span>-</span>
                        <span className={styles.claimItemTotal}>{claimed} Shipped</span>
                        
                    </div>
                    <div className={styles.claimItemButtons}>
                        <button onClick={handleDecrement}>-</button>
                        <input 
                            readOnly
                            type='number' 
                            value={claimAmount}
                        />
                        <button onClick={handleIncrement}>+</button>
                        <button 
                            disabled={!isConnected || balance === claimed || claimAmount === 0}
                            
                            onClick={() => setOpenModal(true)}
                            // onClick={handleClaim}
                        >
                            Ship
                        </button>
                    </div>
                </div>
            }  
            {openModal && <ShipOutComponent setOpen ={setOpenModal} order ={order} />}
        </div>
    );
}

export default ClaimComponent; 