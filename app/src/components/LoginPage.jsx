import React, { useState, useEffect } from "react";
import Web3 from "web3";


const LoginPage = ({ onLogin }) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const checkLoggedInUser = () => {
      const userWalletAddress = window.localStorage.getItem("userWalletAddress");
      setAddress(userWalletAddress);
    };

    checkLoggedInUser();
  }, []);

  const handleLogin = () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const accounts = window.web3.eth.getAccounts();
      if (accounts && accounts.length > 0) {
        const userWalletAddress = accounts[0];
        window.localStorage.setItem("userWalletAddress", userWalletAddress);
        setAddress(userWalletAddress);
        onLogin();
      }
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      {address ? (
        <p>Logged in with address: {address}</p>
      ) : (
        <button onClick={handleLogin}>Login with Metamask</button>
      )}
    </div>
  );
};

export default LoginPage;
