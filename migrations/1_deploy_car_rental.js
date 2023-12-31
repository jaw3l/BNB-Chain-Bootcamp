const fs = require('fs');
const CarRental = artifacts.require("CarRental");

module.exports = async function(deployer) {
  await deployer.deploy(CarRental);
  const instance = await CarRental.deployed();
  let carRentalAddress = await instance.address;

  let config = "export const contractAddress = " + carRentalAddress;

  console.log("Contract Address: ", carRentalAddress);

  let data = JSON.stringify(config);

  fs.writeFileSync('config.js', JSON.parse(data));
};