require("@nomicfoundation/hardhat-toolbox");



const OP_GOERLI_API_URL = "https://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
const PRIVATE_KEY = "812eeace1ca352d25a40090732d3b3d2253b36df8b9d493028f954a0bae969b0";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    op_goerli: {
      url: `${OP_GOERLI_API_URL}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
};
