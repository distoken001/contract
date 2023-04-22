require("@nomicfoundation/hardhat-toolbox");

// set proxy
const proxyUrl = "http://127.0.0.1:4780"; // change to yours, With the global proxy enabled, change the proxyUrl to your own proxy link. The port may be different for each client.
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent(proxyUrl);
setGlobalDispatcher(proxyAgent);
const API_URL_GOERLI =
  "https://eth-goerli.g.alchemy.com/v2/2bqhAwakMpyvwmP4PggpuhBgOJWVmbfh";
const API_URL_GOERLI_ARB =
  "https://arb-goerli.g.alchemy.com/v2/3Z1zdRFsUjYSxzBIjSr6Svkej1E4YbNf";
const API_URL_GOERLI_OP =
  "https://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
const PRIVATE_KEY =
  "812eeace1ca352d25a40090732d3b3d2253b36df8b9d493028f954a0bae969b0";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    op_goerli: {
      url: `${API_URL_GOERLI_OP}`,
      accounts: [`${PRIVATE_KEY}`],
      //etherscan: "QI275HDSPDUCUWEGBTRZT16RC118F1CCX5"
    },
    arb_goerli: {
      url: `${API_URL_GOERLI_ARB}`,
      accounts: [`${PRIVATE_KEY}`],
      //etherscan: "38VM7HHKBQF5S2KF9F5UAFV1NXTGS6SGME"
    },
    goerli: {
      url: `${API_URL_GOERLI}`,
      accounts: [`${PRIVATE_KEY}`],
      //etherscan: "38VM7HHKBQF5S2KF9F5UAFV1NXTGS6SGME"
    },
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: "QI275HDSPDUCUWEGBTRZT16RC118F1CCX5",
      arbitrumGoerli: "38VM7HHKBQF5S2KF9F5UAFV1NXTGS6SGME",
      goerli: "FAX9MSYYW9CBBWKNFTIRFVDDPYTH2WZSRD",
    },
  },
};
