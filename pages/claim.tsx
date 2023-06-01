import styles from '../styles/Claim.module.css'
import type { GetServerSideProps, NextPage } from 'next'
import { useAccount } from 'wagmi';
import { Network, Alchemy } from 'alchemy-sdk';
import NavbarComponent from '../components/NavbarComponent';
import ClaimComponent from '../components/ClaimComponent';
import { BigNumber, ethers } from 'ethers';
import FooterComponent from '../components/FooterComponent';
import { Product } from '../models/models';
import { useEffect, useState } from 'react';
import ShipOutBulkComponent from '../components/ShipOutBulkComponent';



interface ordersInfoProps { 
    names: any[]
    tokens: BigNumber[]
    claims: BigNumber[]
}


export const getServerSideProps: GetServerSideProps = async () => {
  
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, //"wQhhyq4-jQcPzFRui3PljR6pzRwd5N_n",
      network: Network.ETH_SEPOLIA,
    };
  
    // init with key and chain info 
    const alchemy = new Alchemy(settings);
    // Print total NFT collection returned in the response:
    const nfts = await alchemy.nft.getNftsForOwner("0xF7B083022560C6b7FD0a758A5A1edD47eA87C2bC" , {contractAddresses: ['0x1F005f90d9723bc5b4Df5CF4E7c5A5BEaC633F99']})
    const ownedProducts = JSON.stringify(nfts)
    console.log(nfts) 
    // Pass data to the page via props
    return { props: { ownedProducts } }
}


const ClaimPage: NextPage <{ ownedProducts: string }> = ({ ownedProducts }) => {

    const {isConnected} = useAccount()

    const ownProducts = (JSON.parse(ownedProducts)).ownedNfts
    console.log(ownProducts) 
    // show nfts owned
    // and claims available for each item    
    //const {address, isConnected} = useAccount()

    const [openModal, setOpenModal] = useState(false)
    const [orders, setOrders] = useState<any[]>([]);
    const [finalOrders, setFinalOrders] = useState<ordersInfoProps>();
    const [shippable, setShippable] = useState<boolean>()

    console.log(orders)
    console.log(orders.length)
            
    //might need to trim results here esp for zero claims left or zero selected
    //stay tuned...

    useEffect(() => {
        const tokens = []
        const claims = []
        const names = []

        for (let i = 0; i < orders.length; i++) {
            //console.log(orders.length)
            
            if (orders[i].remain !== 0 && orders[i].claim !== 0) {
                names.push(orders[i].name)
                tokens.push(BigNumber.from(orders[i].token))
                claims.push(BigNumber.from(orders[i].claim))   
            }
            
        }

        const ordersInfo ={ 
            names: names,
            tokens: tokens,
            claims: claims
        }

        
        if (ordersInfo.claims.length === 0) {
            setShippable(false)
        } else {
            setShippable(true)
        }

        console.log(tokens, claims)
        setFinalOrders(ordersInfo)

    },[orders] ) 

    
    
    
    const handleOrders = (order: any) => {
        setOrders((prevOrders) => {
          // Check if the order already exists in the array
          const orderExists = prevOrders.some((prevOrder) => prevOrder.token === order.token);
    
          if (orderExists) {
            // Update the existing order in the array
            return prevOrders.map((prevOrder) => (prevOrder.token === order.token ? order : prevOrder));
          } else {
            // Add the new order to the array
            return [...prevOrders, order];
          }
        });
    };
    
    return (
        <div>
            <div>
                <div>
                    <NavbarComponent/>
                </div>
                <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <div className={styles.claim}>
                            <div className={styles.claimItems}>
                                {
                                    ownProducts.length <= 0 
                                    ? <h1>you have no claims</h1>
                                    : ownProducts.map(( product: Product) => 
                                        <ClaimComponent 
                                            key={product.tokenId} 
                        
                                            product={product} 
                                            Order={handleOrders}
                                        /> 
                                    )
                                }
                            </div>
                            <div>
                                <button 
                                    onClick={() => setOpenModal(true)}
                                    disabled={!shippable || !isConnected}
                                >
                                    Ship Selected
                                </button>
                            </div>
                        </div>
                    </div>
                    {openModal && <ShipOutBulkComponent setOpen ={setOpenModal} finalOrders ={finalOrders} />}
                </div>
                <div>
                    <FooterComponent/>
                </div>
            </div>
        </div>
    );
}

export default ClaimPage;