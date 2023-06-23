# BNB Chain Bootcamp - dApp Development

## Introduction

This repository contains the source code for the dApp developed during the Patika.dev's BNB Chain Bootcamp.

###

Deployed contract address on BNB Chain Testnet: 0x6BD76976592708f64D0344c057c2450b8D362389

BSC Scan Link: https://testnet.bscscan.com/address/0x6BD76976592708f64D0344c057c2450b8D362389


### Test Results

```log
╰─$ npx hardhat test


  Contract: CarRental
    Add user and Car
      ✔ should add a user (131ms)
      ✔ should add a car (62ms)
    Check out and check in a car
      ✔ should check out a car (67ms)
      ✔ should check in a car (5090ms)
    Deposit token and make payment
      ✔ should deposit token (39ms)
      ✔ should make payment (5098ms)
    Edit car
      ✔ should edit car's metadata (57ms)
      ✔ should update car's status (52ms)
    Withdraw balance
      ✔ should send the desired amount of tokens to the user (59ms)
      ✔ should send the desired amount of tokens to the owner (5099ms)


  10 passing (43s)
```