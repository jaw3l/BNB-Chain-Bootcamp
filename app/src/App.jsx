import { useState, useEffect } from "react";
import Cars from "./components/Cars";
import Information from "./components/Information";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import Web3 from "web3";
import { login, getUserAddress, getCarByStatus, getCar, getOwner } from "./hooks/web3Dapp"; // prettier-ignore
import { register, login, getUserAddress, getCarsByStatus, getCar, getOwner } from "./hooks/web3Dapp"; // prettier-ignore

import Header from "./components/Header";

import { ChakraProvider } from '@chakra-ui/react'
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";

const web3 = new Web3();

function App() {
  const [address, setAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [cars, setCars] = useState([]);
  const [name, setName] = useState({});
  const [lastName, setLastName] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCredit, setUserCredit] = useState("0");
  const [due, setDue] = useState(0);
  const [isAvailable, setIsAvailable] = useState("Can Rent");
  const [rideMins, setRideMins] = useState("0");

  const emptyAddress = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    let handleInit = async () => {
      let user = await login();
      // If the user has an address, they are logged in
      if (user.address !== emptyAddress) {
        if (user.name) {
          setLoggedIn(true);
          setUserCredit(web3.utils.fromWei(user.balance, "ether").toString());
        }
        let userDue = Web3.utils.fromWei(String(user.debt), "ether").toString();
        setDue(userDue);
        setUserName(user.name);
        
        let address = await getUserAddress();
        let owner = await getOwner();

        if (address === owner.toLowerCase()) {
          setIsAdmin(true);
        }
        
        let carArray = [];
        let carsByStatus = await getCarsByStatus(0);
        carArray.push(...carsByStatus);
        if (user.rentedCarId !== "2") {
          const rentedCar = await getCar(Number(user.rentedCarId));
          carArray.push(rentedCar);
        }
        setCars(carArray);

        if (user.rentedCarId !== "2") {
          let rentedCar = await getCar(Number(user.rentedCarId));
          setIsAvailable(`Rented: ${rentedCar.brand} ${rentedCar.model} - ID :${rentedCar.id}`);
        }

        let rideMins = "0";
        if (user.rentedCarId !== "2") {
          rideMins = Math.floor(
            Math.floor(Date.now() / 1000 - user.start)
          ).toString();
        }
        setRideMins(rideMins);
      }
    };
    handleInit();
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  useEffect(() => {
    if (due !== 0) {
      setIsAvailable("You have to pay your debt");
    }
  }, [due]);

  return (
    <>
      <ChakraProvider>
        <NavBar name={userName} lastName={lastName} address={address}/>
        <div>
          {loggedIn ? (
            <div>
              <Information
                userCredit={userCredit}
                due={due}
                rideMins={rideMins}
                isAvailable={isAvailable}
              />
              <div>
                {cars.length > 0 ? (
                  cars.map((car) => {
                    return (
                      <Cars
                        id={car.id}
                        brand={car.brand}
                        model={car.model}
                        image={car.imageUrl}
                        rentFee={car.rentPrice}
                        saleFee={car.salePrice}
                        carStatus={car.status}
                      />
                    );
                  })
                ) : (
                  <div>Cars are loading</div>
                )}
              </div>
            </div>
          ) : (
            // <LoginPage />
            <RegisterPage onRegistration={handleRegistration} />
          )}
        </div>
        {isAdmin && <AdminDashboard />}
      </ChakraProvider>
    </>
  );
}

export default App;
