
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { cartState } from '../atom/cartState';
import { useRecoilState } from 'recoil'
import Link from 'next/link';

const NavbarComponent = () => {

    const [cartItemn] = useRecoilState(cartState)

    return (
        <div className="navbar">
            <Link href='/'><div>dCommerce</div></Link>
            
            {/* Predefined button  */}
            <Web3Button icon="show" label="Connect Wallet" balance="show" />
            {/* Network Switcher Button */}
            <Web3NetworkSwitch />
            
            <Link href='/cart'>
            <span>cart({cartItemn.length})</span>
            </Link>
            
        </div>
    );
}

export default NavbarComponent;