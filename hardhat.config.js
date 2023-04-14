require("@nomicfoundation/hardhat-toolbox");



const GOERLI_API_URL = "https://eth-goerli.g.alchemy.com/v2/auzz3Ba0_bxwxMl1JtC3UTeSs0EGo9S9";
const PRIVATE_KEY = "812eeace1ca352d25a40090732d3b3d2253b36df8b9d493028f954a0bae969b0";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: `${GOERLI_API_URL}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
};
