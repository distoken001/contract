"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opIface = exports.opContract = exports.opChainId = exports.opProviderHttps = exports.opProviderWss = exports.contractABI = exports.dbConfig = exports.opContractAddress = void 0;
const ethers_1 = require("ethers");
const contractABI = require("../../artifacts/contracts/Ebay.sol/Ebay.json").abi;
exports.contractABI = contractABI;
let opContractAddress = "";
exports.opContractAddress = opContractAddress;
let opMonitorWss = "";
let opMonitorHttps = "";
let dbConfig = {};
exports.dbConfig = dbConfig;
if (process.env.NODE_ENV == "dev") {
    exports.opContractAddress = opContractAddress = "0x24d89E128e1DEb40958253435ac41b13d5169fba";
    opMonitorWss =
        "wss://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
    opMonitorHttps =
        "https://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
    exports.dbConfig = dbConfig = {
        host: "97.74.86.12",
        port: 3306,
        database: "ebay",
        user: "dev",
        password: "Dev@1234",
    };
}
else {
}
const opProviderWss = new ethers_1.ethers.providers.WebSocketProvider(opMonitorWss);
exports.opProviderWss = opProviderWss;
const opProviderHttps = new ethers_1.ethers.providers.StaticJsonRpcProvider(opMonitorHttps);
exports.opProviderHttps = opProviderHttps;
const opIface = new ethers_1.ethers.utils.Interface(contractABI);
exports.opIface = opIface;
const opChainId = opProviderHttps
    .getNetwork()
    .then((network) => network.chainId);
exports.opChainId = opChainId;
const opContract = new ethers_1.ethers.Contract(opContractAddress, contractABI, opProviderHttps);
exports.opContract = opContract;
