import React from "react";
import { checkOut, checkIn } from "../hooks/web3Dapp";
import Web3 from "web3";

const Cars = (props) => {
  const handleCheckOut = async () => {
    await checkOut(props.id);
  };

  const handleCheckIn = async () => {
    await checkIn(props.id);
  };

  return (
    <div>
      <div>
        <div>
          <img src={props.imageUrl}/>
          <div>
            <span>
              {props.brand} {props.model} - id: {props.id}
            </span>
            <h3 >
              <p>Rent fee : {Web3.utils.fromWei(props.rentPrice)} </p>
              <p>Sale fee: {Web3.utils.fromWei(props.salePrice)} </p>
              <p>{props.carStatus === "0" ? "Available" : "Not Available"}</p>
            </h3>
          </div>
          <div>
            <button
              onClick={() => handleCheckOut(props.id)}
            >
              Check Out
            </button>
            <button
              onClick={() => handleCheckIn()}
            >
              Check In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cars;
