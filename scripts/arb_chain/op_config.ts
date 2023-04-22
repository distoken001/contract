import { ethers } from "ethers";
const contractABI = require("../../artifacts/contracts/Ebay.sol/Ebay.json").abi;
let opContractAddress: string = "";
let opMonitorWss: string = "";
let opMonitorHttps: string = "";
let dbConfig = {};
if (process.env.NODE_ENV == "dev") {
  opContractAddress = "0xD0C5B6365268e5A429688c8Ae45E36e9Ac2d2a4e";
  opMonitorWss =
    "wss://arb-goerli.g.alchemy.com/v2/3Z1zdRFsUjYSxzBIjSr6Svkej1E4YbNf";
  opMonitorHttps =
    "https://arb-goerli.g.alchemy.com/v2/3Z1zdRFsUjYSxzBIjSr6Svkej1E4YbNf";
  dbConfig = {
    host: "97.74.86.12",
    port: 3306,
    database: "ebay",
    user: "dev",
    password: "Dev@1234",
  };
} else {
}

const opProviderWss = new ethers.providers.WebSocketProvider(opMonitorWss);
const opProviderHttps = new ethers.providers.StaticJsonRpcProvider(
  opMonitorHttps
);
const opIface = new ethers.utils.Interface(contractABI);
const opChainId = opProviderHttps
  .getNetwork()
  .then((network) => network.chainId);
const opContract = new ethers.Contract(
  opContractAddress,
  contractABI,
  opProviderHttps
);
export {
  opContractAddress,
  dbConfig,
  contractABI,
  opProviderWss,
  opProviderHttps,
  opChainId,
  opContract,
  opIface,
};
