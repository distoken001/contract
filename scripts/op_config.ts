import { ethers } from "ethers";
const contractABI = require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
let opContractAddress: string = "";
let monitorWss: string = "";
let monitorHttps: string = "";
let dbConfig = {};
if (process.env.NODE_ENV == "dev") {
  opContractAddress = "0xD0C5B6365268e5A429688c8Ae45E36e9Ac2d2a4e";
  monitorWss =
    "wss://opt-goerli.g.alchemy.com/v2/ujuLqrVg0LpzlYy_Lqu4Hjrq4T3rA6Ss";
  monitorHttps =
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
const providerWss = new ethers.providers.WebSocketProvider(monitorWss);
const providerHttps = new ethers.providers.StaticJsonRpcProvider(monitorHttps);
const iface = new ethers.utils.Interface(contractABI);
const chainId = providerHttps.getNetwork().then((network) => network.chainId);
export {
  opContractAddress,
  monitorWss,
  dbConfig,
  monitorHttps,
  contractABI,
  providerHttps,
  providerWss,
  chainId,
  iface,
};
