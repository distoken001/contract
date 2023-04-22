require("@nomicfoundation/hardhat-toolbox");

// set proxy
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent(process.env.PROXY_URL);
setGlobalDispatcher(proxyAgent);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    op_goerli: {
      url: process.env.API_URL_OP,
      accounts: [process.env.PRIVATE_KEY],
    },
    arb_goerli: {
      url: process.env.API_URL_ARB,
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: process.env.OPTIMISTIC_KEY,
      arbitrumGoerli: process.env.ARBITRUM_KEY,
      goerli: process.env.MAIN_KEY,
      optimistic: process.env.OPTIMISTIC_KEY,
      arbitrum: process.env.ARBITRUM_KEY,
      main: process.env.MAIN_KEY,
    },
  },
};
