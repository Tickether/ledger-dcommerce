import type { NextPage } from 'next'
//import Head from 'next/head'
//import Image from 'next/image'
//import styles from '../styles/Home.module.css'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';



const Home: NextPage = () => {
  return (
    <>
      {/* Predefined button  */}
      <Web3Button icon="show" label="Connect Wallet" balance="show" />
      <br />
      <p>it is {process.env.NEXT_PUBLIC_W3M_PROJECT_ID}</p>
      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
      <br />
    </>
  );
}

export default Home
