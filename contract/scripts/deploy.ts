
const hre = require("hardhat");
async function main() {

  const Barter = await hre.ethers.getContractFactory("Barter");
  const barter = await Barter.deploy(50,50,5000,'0xb1B8a8E9c2FFcc0B2072937d170bAe4E794f6238');

  await barter.deployed();
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
