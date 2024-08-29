import '../styles/header.css'

const Header = () => {
    return (
        <div className="header">
           <img src="../../logo.png" alt="Logo" className="header-logo"/>
           <button className="connect-wallet">Connect Wallet</button>
        </div>
    )
}

export default Header;