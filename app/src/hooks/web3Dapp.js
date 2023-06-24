import Web3 from 'web3';
import RenterABI from '../contracts/CarRental.json';
import contract from '../contracts';

let renterContractAddress = contract.address;
let selectedAccount;
let renterContract;
let isInitialized = false;

export const init = async () => {
  let provider = await window.ethereum;

  if (typeof provider !== 'undefined') {
    provider
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        selectedAccount = accounts[0];
      })
      .catch(err => {
        console.log(err);
        return;
      });
  }

  window.ethereum.on('accountsChanged', accounts => {
    selectedAccount = accounts[0];
  });

  
  const web3 = new Web3(provider);
  renterContract = new web3.eth.Contract(RenterABI.abi, renterContractAddress);
  isInitialized = true;
};

export const login = async () => {
  if (!isInitialized) {
    await init();
  }
  if (selectedAccount == null) {
    return;
  }
  try {
    let response = await renterContract.methods.getUser(selectedAccount).call();
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const register = async (name, surname) => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .addUser(name, surname)
      .send({ from: selectedAccount });
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getUserAddress = async () => {
  if (!isInitialized) {
    await init();
  }
  return selectedAccount;
};

export const setOwner = async _newOwner => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .setOwner(_newOwner.toLowerCase())
      .send({ from: selectedAccount });
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const addCar = async (brand, model, imageUrl, rentPrice, salePrice) => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .addCar(brand, model, imageUrl, rentPrice, salePrice)
      .send({ from: selectedAccount });
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const updateCarMetadata = async (id, brand, model, imageUrl, rentPrice, salePrice) => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .updateCarMetadata(id, brand, model, imageUrl, rentPrice, salePrice)
      .send({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateCarStatus = async (id, status) => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .updateCarStatus(id, status)
      .send({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const checkOut = async id => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .checkOut(id)
      .send({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const checkIn = async () => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .checkIn()
      .send({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deposit = async value => {
  if (!isInitialized) {
    await init();
  }
  let sending_ether = Web3.utils.toWei(value, 'ether');
  try {
    let res = await renterContract.methods
      .deposit()
      .send({ from: selectedAccount, value: sending_ether });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const makePayment = async () => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .makePayment()
      .send({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawBalance = async amount => {
  if (!isInitialized) {
    await init();
  }
  let sending_ether = Web3.utils.toWei(amount, 'ether');
  try {
    let res = await renterContract.methods
      .withdrawBalance(sending_ether)
      .send({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawOwnerBalance = async amount => {
  if (!isInitialized) {
    await init();
  }
  let sending_ether = Web3.utils.toWei(amount, 'ether');
  try {
    let res = await renterContract.methods
      .withdrawOwnerBalance(sending_ether)
      .send({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getOwner = async () => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods.getOwner().call();
    return res.toString();
  } catch (error) {
    console.log(error);
  }
};

export const getCar = async id => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods.getCar(id).call();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCarByStatus = async status => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods.getCarsByStatus(status).call();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentCount = async () => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods.getCurrentCount().call();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBalance = async () => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods.getBalance().call();
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTotalPayments = async () => {
  if (!isInitialized) {
    await init();
  }
  try {
    let res = await renterContract.methods
      .getTotalPayments()
      .call({ from: selectedAccount });
    return res;
  } catch (error) {
    console.log(error);
  }
};
