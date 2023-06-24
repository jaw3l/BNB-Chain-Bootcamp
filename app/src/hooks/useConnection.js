import { ethers } from 'ethers';
import { useState } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

const useConnection = () => {
  const [signer, setSigner] = useState(undefined);
  const [provider, setProvider] = useState('');
  const [address, setAddress] = useState('');
  const [auth, setAuth] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    if (!window.ethereum) {
    //   alert('metamask is not installed!');
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Metamask</AlertTitle>
        <AlertDescription>
          Metamask is not installed!
        </AlertDescription>
      </Alert>;
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    try {
      setIsConnecting(true);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setProvider(provider);
      setAddress(address);
      setAuth(true);
      setIsConnecting(false);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    connect,
    signer,
    provider,
    address,
    auth,
    isConnecting,
  };
};

export default useConnection;
