require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.development" });

// set proxy
// const { ProxyAgent, setGlobalDispatcher } = require("undici");
// const proxyAgent = new ProxyAgent(process.env.PROXY_URL);
// setGlobalDispatcher(proxyAgent);
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    op: {
      url: process.env.API_HTTP_OP,
      accounts: [process.env.PRIVATE_KEY],
    },
    arb: {
      url: process.env.API_HTTP_ARB,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: process.env.API_HTTP_MAIN,
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon: {
      url: process.env.API_HTTP_POLYGON,
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
      polygon: process.env.POLYGON_KEY,
      polygonMumbai: process.env.POLYGON_KEY,
      bsc: process.env.BSC_KEY,
    },
  },
};
