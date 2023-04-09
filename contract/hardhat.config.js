require("@nomicfoundation/hardhat-toolbox");
const SCROLL_API_URL ="https://scroll-alpha.unifra.io/v1/a0a265e618f846debe679c10cd82b1e4";
const PRIVATE_KEY ="812eeace1ca352d25a40090732d3b3d2253b36df8b9d493028f954a0bae969b0";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    scroll: {
      url:`${SCROLL_API_URL}`,
      accounts:[`${PRIVATE_KEY}`]
    }
  },
};
