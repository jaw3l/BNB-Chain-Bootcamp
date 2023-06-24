import { React, useState } from 'react';
import NavBar from './components/NavBar';
import { Logo } from './components/Logo';
import RegisterPage from './components/RegisterPage';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ChakraProvider, Box, Text, Link as ReachLink, VStack, Grid, theme} from '@chakra-ui/react'; // prettier-ignore

import useContract from './hooks/useContract';
import carRental from './contracts'; 

function App() {
  const [accounts, setAccounts] = useState([]);
  const contract = useContract(carRental.address, carRental.abi);

  console.log(contract);
  return (
    <ChakraProvider theme={theme}>
      <div>APP</div>
      <NavBar />
    </ChakraProvider>
  );
}

export default App;
