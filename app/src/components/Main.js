import { useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import carRentalABI from '../contracts/CarRental.json';

const CarRentalAddress = "0x6BD76976592708f64D0344c057c2450b8D362389";
const CarRentalABI = carRentalABI.abi;

const Main = ({ accounts, setAccounts }) => {
    const [carRental, setCarRental] = useState(1);
    const isConnected = Boolean(accounts[0]);

    async function handleInit() {}
}

export default Main;