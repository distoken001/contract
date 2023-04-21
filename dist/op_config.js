"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iface = exports.chainId = exports.providerWss = exports.providerHttps = exports.contractABI = exports.monitorHttps = exports.dbConfig = exports.monitorWss = exports.opContractAddress = void 0;
const ethers_1 = require("ethers");
const contractABI = require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
exports.contractABI = contractABI;
let opContractAddress = "";
exports.opContractAddress = opContractAddress;
let monitorWss = "";
exports.monitorWss = monitorWss;
let monitorHttps = "";
exports.monitorHttps = monitorHttps;
let dbConfig = {};
exports.dbConfig = dbConfig;
if (process.env.NODE_ENV == "dev") {
    exports.opContractAddress = opContractAddress = "0x7Ea3Fb58959b0bbF66402a09d2cE3263b0B76b73";
    exports.monitorWss = monitorWss =
        "wss://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
    exports.monitorHttps = monitorHttps =
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
const providerWss = new ethers_1.ethers.providers.WebSocketProvider(monitorWss);
exports.providerWss = providerWss;
const providerHttps = new ethers_1.ethers.providers.StaticJsonRpcProvider(monitorHttps);
exports.providerHttps = providerHttps;
const iface = new ethers_1.ethers.utils.Interface(contractABI);
exports.iface = iface;
const chainId = providerHttps.getNetwork().then((network) => network.chainId);
exports.chainId = chainId;
