import { ethers } from "ethers";
const contractABI = require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
let opContractAddress: string = "";
let monitorWss: string = "";
let monitorHttps: string = "";
let dbConfig = {};
if (process.env.NODE_ENV == "dev") {
  opContractAddress = "0x7Ea3Fb58959b0bbF66402a09d2cE3263b0B76b73";
  monitorWss =
    "wss://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
  monitorHttps =
    "https://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
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
