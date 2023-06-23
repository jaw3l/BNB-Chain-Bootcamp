const CarRental = artifacts.require("CarRental");

contract("CarRental", accounts => {
  let carRental;
  const owner = accounts[0];
  const renter = accounts[1];

  beforeEach(async () => {
    carRental = await CarRental.new();
  });

  describe("Add user and Car", () => {
    it("should add a user", async () => {
      await carRental.addUser("John", "Doe", { from: renter });
      const user = await carRental.getUser(renter);
      assert.equal(user.name, "John", "Problem with adding a user's name");
      assert.equal(user.surname, "Doe", "Problem with adding a user's surname");
    });

    it("should add a car", async () => {
      await carRental.addCar("Nissan", "R34 GT-R", "https://example.com", 6, 100000, { from: owner });
      const car = await carRental.getCar(1);
      assert.equal(car.carBrand, "Nissan", "Problem with adding a car's brand");
      assert.equal(car.carModel, "R34 GT-R", "Problem with adding a car's model");
      assert.equal(car.carImageUrl, "https://example.com", "Problem with adding a car's image");
      assert.equal(car.carRentPrice, 6, "Problem with adding a car's rent price");
      assert.equal(car.carSalePrice, 100000, "Problem with adding a car's sale price");
    });
  });
  
  describe("Check out and check in a car", () => {
    it("should check out a car", async () => {
      await carRental.addUser("John", "Doe", { from: renter });
      await carRental.addCar("Nissan", "R34 GT-R", "https://example.com", 6, 100000, { from: owner });
      await carRental.checkOut(1, { from: renter });
      
      const user = await carRental.getUser(renter);
      assert.equal(user.rentedCarId, 1, "Problem with checking out a car")
    });

    it("should check in a car", async () => {
      await carRental.addUser("John", "Doe", { from: renter });
      await carRental.addCar("Nissan", "R34 GT-R", "https://example.com", 6, 100000, { from: owner });
      await carRental.checkOut(1, { from: renter });
      
      await new Promise((resolve) => setTimeout(resolve, 5000));

      await carRental.checkIn({ from: renter });
      const user = await carRental.getUser(renter);

      assert.equal(user.rentedCarId, 0, "Problem with checking in a car");
      assert.equal(user.debt, 30, "User's debt is not correct");
    });
  });

  describe("Deposit token and make payment", () => {
    it("should deposit token", async () => {
      await carRental.addUser("John", "Doe", { from: renter });
      await carRental.deposit({ from: renter, value: 500 });
      const user = await carRental.getUser(renter);
      assert.equal(user.balance, 500, "Problem with depositing token");
    });
    
    it("should make payment", async () => {
      await carRental.addUser("John", "Doe", { from: renter });
      await carRental.addCar("Nissan", "R34 GT-R", "https://example.com", 6, 100000, { from: owner });
      await carRental.checkOut(1, { from: renter });
      await new Promise(resolve => setTimeout(resolve, 5000));
      await carRental.checkIn({ from: renter });
      await carRental.deposit({ from: renter, value: 500 });
      await carRental.makePayment({ from: renter });
      const user = await carRental.getUser(renter);
      assert.equal(user.debt, 0, "Something went wrong while making payment");
      assert.equal(user.balance, 470, "Something went wrong while making payment");
    });
  });

  describe("Edit car", () => {
    it("should edit car's metadata", async () => {
      await carRental.addCar("Nissan", "R34 GT-R", "https://example.com", 6, 100000, { from: owner });

      const newCarBrand = "BMW";
      const newCarModel = "M3";
      const newCarImageUrl = "exampleurl";
      const newCarRentPrice = 5;
      const newCarSalePrice = 50000;
      await carRental.updateCarMetadata(1, newCarBrand, newCarModel, newCarImageUrl, newCarRentPrice, newCarSalePrice, { from: owner });

      const car = await carRental.getCar(1);
      assert.equal(car.carBrand, newCarBrand, "Problem with editing a car's brand");
      assert.equal(car.carModel, newCarModel, "Problem with editing a car's model");
      assert.equal(car.carImageUrl, newCarImageUrl, "Problem with editing a car's image");
      assert.equal(car.carRentPrice, newCarRentPrice, "Problem with editing a car's rent price");
      assert.equal(car.carSalePrice, newCarSalePrice, "Problem with editing a car's sale price");
    });

    it("should update car's status", async () => {
      await carRental.addCar("Nissan", "R34 GT-R", "https://example.com", 6, 100000, { from: owner });
      const newStatus = 2;
      await carRental.updateCarStatus(1, newStatus, { from: owner });
      const car = await carRental.getCar(1);
      assert.equal(car.carStatus, newStatus, "Problem with updating a car's status");
    });
  });

  describe("Withdraw balance", () => {
    it("should send the desired amount of tokens to the user", async () => {
      await carRental.addUser("John", "Doe", { from: renter });
      await carRental.deposit({ from: renter, value: 500 });
      await carRental.withdrawBalance(250, { from: renter });

      const user = await carRental.getUser(renter);
      assert.equal(user.balance, 250, "Problem with withdrawing balance");
    });

    it("should send the desired amount of tokens to the owner", async () => {
      await carRental.addUser("John", "Doe", { from: renter });
      await carRental.addCar("Nissan", "R34 GT-R", "https://example.com", 6, 100000, { from: owner });
      await carRental.checkOut(1, { from: renter });
      await new Promise(resolve => setTimeout(resolve, 5000));
      await carRental.checkIn({ from: renter });
      await carRental.deposit({ from: renter, value: 1500 });
      await carRental.makePayment({ from: renter });
      
      const totalPaymentAmount = await carRental.getTotalPayments({ from: owner });
      const amountToWithdraw = totalPaymentAmount - 30;
      await carRental.withdrawOwnerBalance(amountToWithdraw, { from: owner });
      const totalPayment = await carRental.getTotalPayments({ from: owner });
      assert.equal(totalPayment, 30, "Problem with withdrawing owner's balance");

    });
  });

});
