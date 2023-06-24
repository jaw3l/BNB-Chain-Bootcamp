import { useState, useEffect } from "react";
import Header from "./components/Header";
import Cars from "./components/Cars";
import Information from "./components/Information";
import Footer from "./components/Footer";
import AdminDashboard from "./components/AdminDashboard";
import Web3 from "web3";
import { login, getUserAddress, getCarByStatus, getCar, getOwner } from "./hooks/web3Dapp"; // prettier-ignore


import { ChakraProvider } from '@chakra-ui/react'
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";

const web3 = new Web3();

function App() {
  const [address, setAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [car, setCar] = useState([]);
  const [name, setName] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [userCredit, setUserCredit] = useState("0");
  const [due, setDue] = useState(0);
  const [isAvailable, setIsAvailable] = useState("You can rent a car!");
  const [rideMins, setRideMins] = useState("0");

  const emptyAddress = "0x0000000000000000000000000000000000000000";

  useEffect(() => {
    let handleInit = async () => {
      let user = await login();
      if (user.address !== emptyAddress) {
        if (user.name) {
          setLoggedIn(true);
          setUserCredit(web3.utils.fromWei(user.balance, "ether"));
        }
        console.log(user)
        setFirstName(user.name);
        setLastName(user.surname);
        setAddress(user.walletAddress);
        let userDue = Web3.utils.fromWei(user.debt, "ether");
        setDue(Number(userDue));

        let address = await getUserAddress();
        let owner = await getOwner();
        console.log(owner.toLowerCase())
        if (address === owner.toLowerCase()) {
          setIsAdmin(true);
        }
        
        let carArray = [];
        // console.log(carArray);
        let carByStatus = await getCarByStatus(0);
        carArray.push(...carByStatus);
        if (user.rentedCarId !== "2") {
          let rentedCar = await getCar(Number(user.rentedCarId));
          carArray.push(rentedCar);
        }
        setCar(carArray);

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

  const handleRegistration = () => {
    setLoggedIn(true);
    localStorage.setItem("loggedIn", true);
  };

  useEffect(() => {
    if (due !== 0) {
      setIsAvailable("You have to pay your debt");
    }
  }, [due]);

  return (
    <>
      <ChakraProvider>
        <NavBar name={firstName} lastName={lastName} address={address}/>
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
                {car.length > 0 ? (
                  car.map((car) => {
                    return (
                      <Cars
                        key={car.id}
                        brand={car.brand}
                        model={car.model}
                        id={car.id}
                        image={car.imageUrl}
                        rentFee={car.rentPrice}
                        saleFee={car.salePrice}
                        carStatus={car.status}
                        due={due}
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
