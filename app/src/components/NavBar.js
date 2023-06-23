import React from 'react';

const NavBar = ({accounts, setAccounts}) => {
    const isConnected = Boolean(accounts[0])

    async function connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccounts(accounts);
            } catch (error) {
                console.error(error);
            }
        }

    return (
        <div>
            {/* Left Side */}
            <div>Logo</div>

            {/* Right Side */}
            
            <div>Name</div>
            <div>Surname</div>
            <div>WalletAddress</div>
            
            {isConnected ? (
                <div>Connected</div>,
                <div>WalletAddress</div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
    };
};

export default NavBar;