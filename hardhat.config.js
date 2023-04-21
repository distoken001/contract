require("@nomicfoundation/hardhat-toolbox");

// set proxy
const proxyUrl = 'http://127.0.0.1:4780';   // change to yours, With the global proxy enabled, change the proxyUrl to your own proxy link. The port may be different for each client.
 const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent(proxyUrl);
setGlobalDispatcher(proxyAgent);
const API_URL_GOERLI_ARB = "https://opt-goerli.g.alchemy.com/v2/ujuLqrVg0LpzlYy_Lqu4Hjrq4T3rA6Ss";
const API_URL_GOERLI_OP = "https://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
const PRIVATE_KEY = "812eeace1ca352d25a40090732d3b3d2253b36df8b9d493028f954a0bae969b0";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    op_goerli: {
      url: `${API_URL_GOERLI_OP}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    arb_goerli: {
      url: `${API_URL_GOERLI_ARB}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
    etherscan: {
      apiKey: {
        optimisticGoerli: "QI275HDSPDUCUWEGBTRZT16RC118F1CCX5"
      }
    }
  
};
