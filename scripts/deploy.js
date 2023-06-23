const hre = require("hardhat");

async function main() {
  const CarRental = await hre.ethers.getContractFactory("CarRental");
  const carRental = await CarRental.deploy();

  await carRental.waitForDeployment();

  console.log("CarRental deployed to:", carRental.target);
  
  // Write contract address to config file
  const config = `export const contractAddress = "${carRental.target}";`;
  require("fs").writeFileSync("config.js", config);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

