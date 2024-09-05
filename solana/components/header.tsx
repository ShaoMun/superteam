import '../styles/header.css'
import ConnectWalletButton from './ConnectWalletButton';

const Header = () => {
    return (
        <div className="header">
           <img src="../../logo.png" alt="Logo" className="header-logo"/>
           <ConnectWalletButton/>
        </div>
    )
}

export default Header;