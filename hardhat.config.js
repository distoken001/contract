require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// set proxy
//const { ProxyAgent, setGlobalDispatcher } = require("undici");
//const proxyAgent = new ProxyAgent(process.env.PROXY_URL);
//setGlobalDispatcher(proxyAgent);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  paths: {
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    op_goerli: {
      url: process.env.API_HTTP_OP,
      accounts: [process.env.PRIVATE_KEY],
    },
    arb_goerli: {
      url: process.env.API_HTTP_ARB,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      url: process.env.API_HTTP_MAIN,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: process.env.OPTIMISTIC_KEY,
      arbitrumGoerli: process.env.ARBITRUM_KEY,
      goerli: process.env.MAIN_KEY,
      optimisticEthereum: process.env.OPTIMISTIC_KEY,
      arbitrumOne: process.env.ARBITRUM_KEY,
      mainnet: process.env.MAIN_KEY,
    },
  },
};
