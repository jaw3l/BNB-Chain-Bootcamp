import React, { useState } from "react";
import { register } from "./Web3Dapp";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");

  const handleRegister = async () => {
    try {
      const response = await register(firstName, lastName);
      // Handle the registration response as needed
      console.log(response);
      setRegistrationStatus("Registration successful!");
    } catch (error) {
      console.log(error);
      setRegistrationStatus("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Registration Page</h2>
      <label>
        First Name:
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Last Name:
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleRegister}>Register</button>
      <p>{registrationStatus}</p>
    </div>
  );
};

export default RegisterPage;
