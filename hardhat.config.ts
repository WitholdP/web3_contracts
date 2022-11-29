import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const API_KEY_DEVELOP = process.env.ALCHEMY_KEY_DEVELOP;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${API_KEY_DEVELOP}`,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: "auto",
      gasPrice: "auto",
    },
  },
};

export default config;
