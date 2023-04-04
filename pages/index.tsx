import type { NextPage } from 'next'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { Network, Alchemy } from 'alchemy-sdk';
import Link from "next/link";







export async function getStaticProps() {
  
  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, //"wQhhyq4-jQcPzFRui3PljR6pzRwd5N_n",
    network: Network.ETH_SEPOLIA,
  };

  // init with key and chain info 
  const alchemy = new Alchemy(settings);
  // Print total NFT collection returned in the response:
  const loadProducts = await alchemy.nft.getNftsForContract("0x76b41A6b4f4F53F8d15163FBC23b9C2B306b48DA")
  const loadedProducts = JSON.stringify(loadProducts)

  // Pass data to the page via props
  return { props: { loadedProducts } }
}

const Home: NextPage <{ loadedProducts: string }> = ({ loadedProducts }) => {
  
  const loadProducts = /* Object.entries */((JSON.parse(loadedProducts)).nfts)
  console.log(loadProducts)
  
  

  return (
    <>
      {/* Predefined button  */}
      <Web3Button icon="show" label="Connect Wallet" balance="show" />
      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
      
      {/* 
      <div>
    
      {loadProducts.map(()=>(
        
        <Rentals item={item} key={item.tokenId}/> 
      ))}
        
      </div>
      */}
      
    </>
  );
}

export default Home


// unused snippets
//import { useEffect } from 'react';

//import { SDK, Auth } from '@infura/sdk';

/*
const auth = new Auth({
  projectId: process.env.INFURA_API_KEY,
  secretId: process.env.INFURA_API_KEY_SECRET,
  privateKey: process.env.WALLET_PRIVATE_KEY,
  chainId: 1115511

})
*/
//const sdk = new SDK(auth);


/*
  useEffect(()=>{
    async function loadProducts() {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, //"wQhhyq4-jQcPzFRui3PljR6pzRwd5N_n",
        network: Network.ETH_SEPOLIA,
      };
    
      const alchemy = new Alchemy(settings);
      // Print total NFT collection returned in the response:
      const loadedProducts = await alchemy.nft.getNftsForContract("0x76b41A6b4f4F53F8d15163FBC23b9C2B306b48DA")
      console.log(loadedProducts)
    }
    loadProducts()
  },[])
  */