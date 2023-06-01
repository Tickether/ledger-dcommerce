import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import styles from '../styles/ShipOut.module.css'
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';





const ShipOutComponent = ({setOpen, order} : any) => {

    console.log(order)
    
    const {address, isConnected} = useAccount()
    const { addToast } = useToasts();

    const [ shippingInfo, setShippingInfo ] = useState({
        firstname : undefined,
        lastname : undefined,
        email : undefined,
        phone : undefined,
        address : undefined,
        city : undefined,
        state : undefined,
        zipcode : undefined,
        country : undefined,

    })

    console.log(shippingInfo)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [msg, setMsg] = useState('')
         


    const handleChange = (e : any) => {
        setShippingInfo((prev)=>({...prev, [e.target.id]:e.target.value}))
    };

    
    const prepareContractWriteClaimShipping = usePrepareContractWrite({
        address: '0x1F005f90d9723bc5b4Df5CF4E7c5A5BEaC633F99',
        abi: [
            {
              name: 'claimShipping',
              inputs: [ {internalType: "address", name: "to", type: "address"}, {internalType: "uint256", name: "id", type: "uint256"}, {internalType: "uint256", name: "amount", type: "uint256"} ],
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ],
        functionName: 'claimShipping',
        args: [ (address!), (BigNumber.from(order.token)), (BigNumber.from(order.claim)) ],
        chainId: 11155111,
    })
    

    const  contractWriteClaimShipping = useContractWrite(prepareContractWriteClaimShipping.config)

    const waitForTransaction = useWaitForTransaction({
        hash: contractWriteClaimShipping.data?.hash,
        confirmations: 2,
        onSuccess() {
            addToast(`Processing for Shipping! Check mail for confirmation & tracking!!`, { 
                appearance: 'success',
                autoDismiss: true,     // Whether the toast should automatically dismiss
                autoDismissTimeout: 1500, // Timeout in milliseconds before the toast automatically dismisses
    
            });
            sendMail()
            setOpen(false)
        },
    })

    const sendMail = async () => {
        try {
            const res = await fetch('api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(shippingInfo),
            })
            if (res.ok) {
                const data = await res.json();
                console.log(data); // Handle the response from the API
            } else {
                console.error('Error sending email:', res.statusText);
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    const handleClaim = async () => {
        try {
            await contractWriteClaimShipping.writeAsync?.()
        } catch (err) {
            console.log(err)
        }    
    }

    const handleCLick = async (e : any) => {
        e.preventDefault()
        const form = e.target;

        if (form.checkValidity()) {
            setLoading(true);
            console.log('Form is valid. Proceed with submission.');
            
            // Rest of your code for handling form submission
            await handleClaim()
        } else {
            console.log('Form is invalid. Cannot submit.');
        }
       
    };
      
      
    
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <h1>Shipping</h1>
                <p>Please enter your shipping details.</p>
                <hr />
                <div className={styles.formWrapper}>
                    <form className={styles.form} onSubmit={handleCLick}>
                        <div className={styles.name}>
                            <label >
                                <span>First name</span>
                                <input 
                                    type="text" 
                                    id="firstname" 
                                    placeholder="John" 
                                    onChange={handleChange} 
                                    required
                                />
                            </label>
                            <label>
                                <span>Last name</span>
                                <input 
                                    type="text" 
                                    id="lastname" 
                                    placeholder="Doe" 
                                    onChange={handleChange} 
                                    required
                                />
                            </label>
                        </div>
                        <div className={styles.contact}>
                            <label >
                                <span>Email</span>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="John@mail.lol" 
                                    onChange={handleChange} 
                                    required
                                />
                            </label>
                            <label>
                                <span>Phone</span>
                                <input 
                                    type="number" 
                                    id="phone" 
                                    placeholder="0208887779"
                                    onChange={handleChange} 
                                    required
                                />
                            </label>
                        </div>
                        <div className={styles.address}>
                            <label>
                                <span>Address</span>
                                <input 
                                    type="text" 
                                    id="address" 
                                    onChange={handleChange} 
                                    required
                                />
                            </label>
                        </div>
                        <div className={styles.location}>
                            <label >
                                <span>City</span>
                                <input 
                                    type="text" 
                                    id="city"
                                    onChange={handleChange} 
                                    required 
                                />
                            </label>
                            <label>
                                <span>State</span>
                                <input 
                                    type="text" 
                                    id="state" 
                                    onChange={handleChange} 
                                    required
                                />
                            </label>
                            <label>
                                <span>Zip code</span>
                                <input 
                                    type="text" 
                                    id="zipcode" 
                                    onChange={handleChange} 
                                    required
                                />
                            </label>
                        </div>
                        <div className={styles.country}>
                            <label>
                                <span>Country</span>
                                    <select 
                                        id="country" 
                                        onChange={handleChange} 
                                        required
                                    >
                                        <option value=""></option>
                                        <option value="unitedstates">United States</option>
                                        <option value="ghana">Ghana</option>
                                        <option value="nigeria">Nigeria</option>
                                    </select>
                            </label>
                        </div>
                        <div className={styles.buttons}>
                            <button 
                                type="submit"
                            >   
                                Ship
                            </button>
                            <button onClick={() => setOpen(false)}>
                            Cancel
                            </button>
                        </div>
                    </form>
                </div>
                
                <hr />
            </div>
        </div>
    );
}

export default ShipOutComponent;