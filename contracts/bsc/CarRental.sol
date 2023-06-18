// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CarRental is ReentrancyGuard{
  
  //! Data

  // Counter
  using Counters for Counters.Counter;
  Counters.Counter private _counter;

  // Owner
  address private owner;

  // Total Payments
  uint private totalPayments;

  // User Struct
  struct User {
    address walletAddress;
    string name;
    string surname;
    uint rentedCarId;
    uint balance;
    uint debt;
    uint startTime;
  }

  // Car Struct
  struct Car {
    uint id;
    string carBrand;
    string carModel;
    string carImageUrl;
    uint carRentPrice;
    uint carSalePrice;
    Status carStatus;
  }

  // Enum - Car Status
  enum Status {
    Available,
    Rented,
    Sold
  }

  // Events
  event CarAdded(uint indexed id, string carcarBrand, string carModel, string carImageUrl, uint carRentPrice, uint carSalePrice);
  event CarMetadataUpdated(uint indexed id, string carBrand, string carModel, string carImageUrl, uint carRentPrice, uint carSalePrice);
  event CarStatusUpdated(uint indexed id, Status carStatus);
  event UserAdded(address indexed walletAddress, string name, string surname);
  event Deposit(address indexed walletAddress, uint amount);
  event Checkout(address indexed walletAddress, uint indexed carId);
  event CheckIn(address indexed walletAddress, uint indexed carId);
  event PaymentMade(address indexed walletAddress, uint amount);
  event BalanceWithdrawn(address indexed walletAddress, uint amount);

  // User Mapping
  mapping(address => User) private users;

  // Car Mapping
  mapping(uint => Car) private cars;

  // Constructor
  constructor() {
    owner = msg.sender;
    totalPayments = 0;
  }

  // Modifiers
  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function!");
    _;
  }

  //! Functions

  function setOwner(address _newOwner) external onlyOwner {
    owner = _newOwner;
  }

  function addUser(string calldata name, string calldata surname) external {
    require(users[msg.sender].walletAddress == address(0), "User already exists!");
    
    require(!isUser(msg.sender), "User already exists!");

    users[msg.sender] = User(msg.sender, name, surname, 0, 0, 0, 0);
    emit UserAdded(msg.sender, users[msg.sender].name, users[msg.sender].surname);
  }

  function addCar(string calldata carBrand, string calldata carModel, string calldata carImageUrl, uint carRentPrice, uint carSalePrice) external onlyOwner {
    _counter.increment();
    uint id = _counter.current();
    cars[id] = Car(id, carBrand, carModel, carImageUrl, carRentPrice, carSalePrice, Status.Available);

    emit CarAdded(id, cars[id].carBrand, cars[id].carModel, cars[id].carImageUrl, cars[id].carRentPrice, cars[id].carSalePrice);
  }

  function updateCarMetadata(uint id, string calldata carBrand, string calldata carModel, string calldata carImageUrl, uint carRentPrice, uint carSalePrice) external onlyOwner {
    require(cars[id].id != 0, "Car does not exist!");

    Car storage car = cars[id];
    
    if(bytes(carBrand).length != 0) {
      car.carBrand = carBrand;
    }

    if (bytes(carModel).length != 0) {
      car.carModel = carModel;
    }

    if (bytes(carImageUrl).length != 0) {
      car.carImageUrl = carImageUrl;
    }

    if (carRentPrice > 0) {
      car.carRentPrice = carRentPrice;
    }

    if (carSalePrice > 0) {
      car.carSalePrice = carSalePrice;
    }

    emit CarMetadataUpdated(id, car.carBrand, car.carModel, car.carImageUrl, car.carRentPrice, car.carSalePrice);
  }

  function updateCarStatus(uint id, Status carStatus) external onlyOwner {
    require(cars[id].id != 0, "Car does not exist!");

    // Car storage car = cars[id];
    // car.carStatus = carStatus;

    cars[id].carStatus = carStatus;

    emit CarStatusUpdated(id, carStatus);
  }
    
  function checkOut(uint id) external {
    require(isUser(msg.sender), "User does not exist!");
    require(cars[id].carStatus == Status.Available, "Car is not available!");
    require(users[msg.sender].rentedCarId == 0, "User already has a rented car!");
    require(users[msg.sender].debt == 0, "User has debt!");

    users[msg.sender].startTime = block.timestamp;
    users[msg.sender].rentedCarId = id;
    cars[id].carStatus = Status.Rented;

    emit Checkout(msg.sender, id);
  }

  function checkIn() external {
    require(isUser(msg.sender), "User does not exist!");
    uint rentedCarId = users[msg.sender].rentedCarId;
    require(rentedCarId != 0, "User does not have a rented car!");

    uint usedSeconds = block.timestamp - users[msg.sender].startTime;
    uint rentPrice = cars[rentedCarId].carRentPrice;
    users[msg.sender].debt = calculateDebt(usedSeconds, rentPrice);

    users[msg.sender].rentedCarId = 0;
    users[msg.sender].startTime = 0;
    cars[rentedCarId].carStatus = Status.Available;

    emit CheckIn(msg.sender, rentedCarId);
  }

  function deposit() external payable {
    require(isUser(msg.sender), "User does not exist!");
    require(msg.value > 0, "Deposit amount must be greater than 0!");

    users[msg.sender].balance += msg.value;

    emit Deposit(msg.sender, msg.value);
  }

  function makePayment() external {
    require(isUser(msg.sender), "User does not exist!");

    //TODO do we need to add these variables ? require(users[msg.sender].debt > 0, "User does not have debt!"); 
    uint debt = users[msg.sender].debt;
    uint balance = users[msg.sender].balance;

    require(debt > 0, "User does not have debt!");
    require(balance >= debt, "User does not have enough balance!");

    unchecked {
      users[msg.sender].balance -= debt;
    }
    totalPayments += debt;
    users[msg.sender].debt = 0;

    emit PaymentMade(msg.sender, debt);
  }

  function withdrawBalance(uint amount) external nonReentrant {
    require(isUser(msg.sender), "User does not exist!");

    uint balance = users[msg.sender].balance;
    require(balance >= amount, "User does not have enough balance!");

    unchecked {
      users[msg.sender].balance -= amount;
    }

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed.");

    emit BalanceWithdrawn(msg.sender, amount);
  }

  function withdrawOwnerBalance(uint amount) external onlyOwner {
    require(totalPayments >= amount, "Owner does not have enough balance!");

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed.");
    unchecked {
      totalPayments -= amount;
    }
  }


  //! Queries

  function getOwner() external view returns (address) {
    return owner;
  }

  function calculateDebt(uint usedSeconds, uint rentPrice) private pure returns (uint) {
    return usedSeconds * rentPrice;
  }

  function isUser(address walletAddress) private view returns (bool) {
    return users[walletAddress].walletAddress != address(0);
  }

  function getUser(address walletAddress) external view returns (User memory) {
    require(isUser(walletAddress), "User does not exist!");
    return users[walletAddress];
  }

  function getCar(uint id) external view returns (Car memory) {
    require(cars[id].id != 0, "Car does not exist!");
    return cars[id];
  }

  function getCarsByStatus(Status _status) external view returns (Car[] memory) {
    uint count = 0;
    uint length = _counter.current();
    for (uint i = 1; i <= length; i++) {
      if (cars[i].carStatus == _status) {
        count++;
      }
    }

    Car[] memory carsWithStatus = new Car[](count);
    count = 0;
    for (uint i = 1; i <= length; i++) {
      if (cars[i].carStatus == _status) {
        carsWithStatus[count] = cars[i];
        count++;
      }
    }
    return carsWithStatus;
  }

  function getCurrentCount() external view returns (uint) {
    return _counter.current();
  }

  function getContractBalance() external view onlyOwner returns (uint) {
    return address(this).balance;
  }

  function getTotalPayments() external view onlyOwner returns (uint) {
    return totalPayments;
  }

  function getTimestamp() external view returns (uint) {
    return block.timestamp;
  }
}