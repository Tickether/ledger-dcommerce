import styles from '../styles/Navbar.module.css'
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { cartState } from '../atom/cartState';
import { useRecoilState } from 'recoil'
import Link from 'next/link';

const NavbarComponent = () => {

    const [cartItemn] = useRecoilState(cartState)

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.logo}>
                    <Link href='/'>dCommerce</Link>
                </div>
                <div className={styles.right}>
                    <div className={styles.connect}>
                        {/* Network Switcher Button */}
                        <Web3NetworkSwitch />
                                            
                        {/* Predefined button  */}
                        <Web3Button icon="hide" label="Connect Wallet" balance="show" />                     
                    </div>
                    <div className={styles.cart}>
                        <Link href='/cart'>
                            cart({cartItemn.length})
                        </Link>
                    </div>
                   
                    
                </div>
            </div>
            
            
            
        </div>
    );
}

export default NavbarComponent;