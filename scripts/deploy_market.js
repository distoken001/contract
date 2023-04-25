// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Market = await hre.ethers.getContractFactory("Market");
  const market = await Market.deploy(
    200,
    200,
    2000,
    10000,
    "0xb1B8a8E9c2FFcc0B2072937d170bAe4E794f6238"
  );
  await market.deployed();
  console.log(market.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});