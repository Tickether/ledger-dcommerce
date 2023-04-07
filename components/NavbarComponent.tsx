
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';

const NavbarComponent = () => {


    return (
        <div className="navbar">
            {/* Predefined button  */}
            <Web3Button icon="show" label="Connect Wallet" balance="show" />
            {/* Network Switcher Button */}
            <Web3NetworkSwitch />
        </div>
    );
}

export default NavbarComponent;