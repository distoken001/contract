import { ethers } from "ethers";
const contractABI = require("../../artifacts/contracts/Ebay.sol/Ebay.json").abi;
let opContractAddress = process.env.OP_CONTRACT_ADDRESS;
let opMonitorWss: string = "";
let opMonitorHttps: string = "";
let dbConfig = {};
  opMonitorWss =
    "wss://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
  opMonitorHttps =
    "https://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
  dbConfig = {
    host: "97.74.86.12",
    port: 3306,
    database: "ebay",
    user: "dev",
    password: "Dev@1234",
  };

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
