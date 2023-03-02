require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.API_KEY;

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const YOUR_PRIVATE_KEY = process.env.SECRET_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [YOUR_PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
};