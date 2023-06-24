import React from "react";
import { checkOut, checkIn } from "../hooks/web3Dapp";
import Web3 from "web3";

const Cars = ({ id, brand, model, imageUrl, salePrice, rentPrice, carStatus, due }) => {
  const handleCheckOut = async () => {
    const res = await checkOut(id);
    console.log(res);
  };

  console.log(due);

  const handleCheckIn = async () => {
    await checkIn(id);
  };

  return (
    <div >
      <div >
        <div >
          <img src={imageUrl}/>
          <div >
            <span>
              {brand} {model} - id: {id}
            </span>
            <h3 >
              <p>Rent fee : {Web3.utils.fromWei(rentPrice)} </p>
              <p>Sale fee: {Web3.utils.fromWei(salePrice)} </p>
              <p>{carStatus === "0" ? "Available" : "Not Available"}</p>
            </h3>
          </div>
          <div >
            <button
              disabled={due > 0 ? true : false}
              onClick={() => handleCheckOut(id)}
            >
              Check In
            </button>
            <button
              disabled={due > 0 ? true : false}
              onClick={() => handleCheckIn()}
            >
              Check Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
