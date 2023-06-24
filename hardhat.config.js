require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-truffle5');

const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  networks: {
    testnet: {
      url: `https://data-seed-prebsc-2-s1.binance.org:8545/`,
      accounts: { mnemonic: process.env.MNEMONIC }
    },
    mainnet: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts: { mnemonic: process.env.MNEMONIC }
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_TESTNET_API_KEY,
    }
  },
  solidity: {
    version: "0.8.4",
        settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};