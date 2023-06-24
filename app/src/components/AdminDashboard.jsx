import React, { useState, useEffect } from "react";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import {
  addCar,
  getTotalPayments,
  withdrawOwnerBalance,
  setOwner,
  getOwner,
  updateCarMetadata,
  updateCarStatus,
} from "../hooks/web3Dapp";

const web3 = new Web3();

const AdminDashboard = () => {
  const [id, setId] = useState(0);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [imageUrl, setUrl] = useState("");
  const [rent, setRent] = useState("");
  const [sale, setSale] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newImageUrl, setNewUrl] = useState("");
  const [status, setStatus] = useState(null);
  const [newRent, setNewRent] = useState("");
  const [newSale, setNewSale] = useState("");
  const [totalPayments, setTotalPayments] = useState(null);
  const [withdrawBalance, setWithdrawBalance] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [currentOwner, setCurrentOwner] = useState(null);

  const convertDecimalToInteger = (decimal, decimalPlaces) => {
    const decimalString = decimal.toString();
    const decimalFactor = new BigNumber(10).exponentiatedBy(decimalPlaces);
    const integer = new BigNumber(decimalString).multipliedBy(decimalFactor);
    return integer.toFixed();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rentPriceInWei = convertDecimalToInteger(rent, 18);
    const salePriceInWei = convertDecimalToInteger(sale, 18);

    let result = await addCar(brand, model, imageUrl, rentPriceInWei, salePriceInWei);
    if (result) {
      console.log("Car added successfully!");
    }
    console.log(result);
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      let result = await withdrawOwnerBalance(withdrawBalance);
      if (result) {
        console.log("Withdrawn successfully" + result);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCarMetadata = async (e) => {
    e.preventDefault();
    const newRentPriceInWei = convertDecimalToInteger(newRent, 18);
    const newSalePriceInWei = convertDecimalToInteger(newSale, 18);
    try {
      let result = await updateCarMetadata(
        id,
        newBrand,
        newModel,
        newImageUrl,
        newRentPriceInWei,
        newSalePriceInWei
      );
      if (result) {
        console.log("Car updated successfully" + result);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCarStatusData = async (e) => {
    e.preventDefault();
    try {
      let result = await updateCarStatus(id, status);
      if (result) {
        console.log("Car status edited successfully!" + result);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetOwner = async (e) => {
    e.preventDefault();
    try {
      let result = await setOwner(ownerAddress);
      if (result) {
        console.log("Owner set successfully" + result);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const owner = await getOwner();
      const totalRevenue = await getTotalPayments();
      console.log(totalRevenue);
      setTotalPayments(totalRevenue);
      setCurrentOwner(owner);
    };
    fetchInfo();
  }, []);

  return (
    <div >
      <div >
        <form onSubmit={handleSubmit}>
          <div>
            <label  htmlFor="brand">
              Brand:
            </label>
            <input
              type="text"
              placeholder="Car Brand"
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="model">
              Model:
            </label>
            <input
              type="text"
              placeholder="Car Model"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="imageUrl">
              Image URL:{" "}
            </label>
            <input
              type="text"
              placeholder="Car Image URL"
              id="url"
              value={imageUrl}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="rent">
              Rent:
            </label>
            <input
              type="text"
              placeholder="Rent Fee"
              id="rent"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="sale">
              Sale:
            </label>
            <input
              type="text"
              placeholder="Sale Fee"
              id="sale"
              value={sale}
              onChange={(e) => setSale(e.target.value)}
            />
          </div>
          <button
            
            type="submit"
          >
            Add Car
          </button>
        </form>
        <span >
          {" "}
          Total Payment : {totalPayments}{" "}
          <input
            type="number"
            placeholder="Withdraw Balance"
            
            onChange={(e) => {
              setWithdrawBalance(e.target.value);
            }}
          />
          <button
            onClick={handleWithdraw}
            
          >
            Withdraw Balance
          </button>
        </span>
        <div >
          <span >
            Current Owner : <span >{currentOwner}</span>{" "}
          </span>
          <input
            placeholder="New Owner Address"
            
            onChange={(e) => {
              setOwnerAddress(e.target.value);
            }}
          />
          <button
            onClick={handleSetOwner}
            
          >
            Set New Owner
          </button>
        </div>
        <form  onSubmit={updateCarMetadata}>
          <div>
            <label  htmlFor="name">
              Id:
            </label>
            <input
              type="text"
              placeholder="Car ID"
              id="name"
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="name">
              Brand:
            </label>
            <input
              type="text"
              placeholder="New Car Brand"
              
              onChange={(e) => setNewBrand(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="name">
              Model:
            </label>
            <input
              type="text"
              placeholder="New Car Model"
              
              onChange={(e) => setNewModel(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="url">
              URL:{" "}
            </label>
            <input
              type="text"
              placeholder="New Car Image URL"
              onChange={(e) => setNewUrl(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="rent">
              Rent:
            </label>
            <input
              type="text"
              placeholder="New Rent Price"
              onChange={(e) => setNewRent(e.target.value)}
            />
          </div>
          <div>
            <label  htmlFor="sale">
              Sale:
            </label>
            <input
              type="text"
              placeholder="New Sale Price"
              onChange={(e) => setNewSale(e.target.value)}
            />
          </div>
          <button
            type="submit"
          >
            Update Car Metadata
          </button>
        </form>
        <form onSubmit={updateCarStatusData}>
          <div>
            <label >Id:</label>
            <input
              type="number"
              placeholder="Car ID"
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div>
            <label >Status:</label>
            <input
              type="number"
              placeholder="Car Status"
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <span >
            0 = Available <br/> 1 = Rented <br/> 2 = Sold
          </span>
          <button
            
            type="submit"
          >
            Update Car Status
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;