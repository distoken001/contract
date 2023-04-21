import { ethers } from "ethers";
const contractABI = require("../../artifacts/contracts/Ebay.sol/Ebay.json").abi;
let arbMonitorWss: string = "";
let arbMonitorHttps: string = "";
let arbContractAddress: string = "";
let dbConfig = {};
if (process.env.NODE_ENV == "dev") {
  arbContractAddress = "0xD0C5B6365268e5A429688c8Ae45E36e9Ac2d2a4e";
  arbMonitorWss =
    "wss://opt-goerli.g.alchemy.com/v2/ujuLqrVg0LpzlYy_Lqu4Hjrq4T3rA6Ss";
  arbMonitorHttps =
    "https://opt-goerli.g.alchemy.com/v2/ujuLqrVg0LpzlYy_Lqu4Hjrq4T3rA6Ss";
  dbConfig = {
    host: "97.74.86.12",
    port: 3306,
    database: "ebay",
    user: "dev",
    password: "Dev@1234",
  };
} else {
}

const arbProviderWss = new ethers.providers.WebSocketProvider(arbMonitorWss);
const arbProviderHttps = new ethers.providers.StaticJsonRpcProvider(
  arbMonitorHttps
);
const opIface = new ethers.utils.Interface(contractABI);
const arbchainId = arbProviderHttps
  .getNetwork()
  .then((network) => network.chainId);
const arbcontract = new ethers.Contract(
  arbContractAddress,
  contractABI,
  arbProviderHttps
);
export {
  arbContractAddress,
  dbConfig,
  contractABI,
  arbProviderWss,
  arbProviderHttps,
  arbchainId,
  arbcontract,
  opIface,
};
