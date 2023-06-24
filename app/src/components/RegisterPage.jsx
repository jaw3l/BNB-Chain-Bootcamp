import React, { useState } from "react";
import { register } from "../hooks/web3Dapp";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Card,
  CardBody,
  Center,
} from "@chakra-ui/react";

const RegisterPage = ({ onRegistration }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let res = await register(name, surname);
      if (res) {
        onRegistration();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFirstNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setSurname(e.target.value);
  };

  return (
    <Box position='relative' h='100px'>
      <Center axis='both'>
        <Card maxWidth="md">
          <CardBody>
            <Box textAlign="center">
              <Heading as="h2" size="md" mb={4}>
                Registration Page
              </Heading>
              <FormControl mb={4}>
                <FormLabel>First Name:</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={handleFirstNameChange}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Last Name:</FormLabel>
                <Input
                  type="text"
                  value={surname}
                  onChange={handleLastNameChange}
                />
              </FormControl>
              <Button colorScheme="blue" onClick={handleRegister}>
                Register
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Center>
    </Box>
  );
};

export default RegisterPage;
