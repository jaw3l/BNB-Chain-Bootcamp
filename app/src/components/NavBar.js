import React from 'react';
import { Box, Button, Flex, Image, Menu, MenuButton, MenuList, MenuItem, Avatar, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Use this if you are using React Router for navigation

// Logo component
const Logo = () => {
  return <Image src="/logo.svg" alt="Company Logo" />;
};

// RegisterButton component
const RegisterButton = () => {
  return (
    <Link to="/register"> {/* Replace with the actual register page route */}
      <Button colorScheme="teal" variant="outline">Register</Button>
    </Link>
  );
};

// UserMenu component
const UserMenu = ({ depositCoins, withdrawCoins, makePayment }) => {
  return (
    <Menu>
      <MenuButton as={Button} size="sm">
        <Avatar size="md" src="/avatar.png" /> {/* Replace with the actual avatar image */}
        <Box ml={2}>
          <Text fontSize="sm">John Doe</Text> {/* Replace with the user's name */}
          <Text fontSize="xs" opacity={0.7}>0x1234...5678</Text> {/* Replace with the user's wallet address */}
        </Box>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={depositCoins}>Deposit Coins</MenuItem>
        <MenuItem onClick={withdrawCoins}>Withdraw Coins</MenuItem>
        <MenuItem onClick={makePayment}>Make Payment</MenuItem>
      </MenuList>
    </Menu>
  );
};

// NavBar component
const NavBar = ({ loggedIn, depositCoins, withdrawCoins, makePayment }) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" p={4}>
      <Box>
        <Logo />
      </Box>
      <Box>
        {loggedIn ? (
          <UserMenu depositCoins={depositCoins} withdrawCoins={withdrawCoins} makePayment={makePayment} />
        ) : (
          <RegisterButton />
        )}
      </Box>
    </Flex>
  );
};

export default NavBar;
