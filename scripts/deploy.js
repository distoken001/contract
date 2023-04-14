// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Ebay = await hre.ethers.getContractFactory("Ebay");
  const ebay = await Ebay.deploy(
    100,
    100,
    5000,
    "0x621d897886b99Ad84a4C32292338cfAF768a5C20"
  );
  await ebay.deployed();
  console.log(ebay.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});