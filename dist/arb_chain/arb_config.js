"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opIface = exports.opContract = exports.opChainId = exports.arbProviderHttps = exports.arbProviderWss = exports.contractABI = exports.dbConfig = exports.arbContractAddress = void 0;
const ethers_1 = require("ethers");
const contractABI = require("../../artifacts/contracts/Ebay.sol/Ebay.json").abi;
exports.contractABI = contractABI;
let arbMonitorWss = "";
let arbMonitorHttps = "";
let arbContractAddress = "";
exports.arbContractAddress = arbContractAddress;
let dbConfig = {};
exports.dbConfig = dbConfig;
if (process.env.NODE_ENV == "dev") {
    exports.arbContractAddress = arbContractAddress = "0xD0C5B6365268e5A429688c8Ae45E36e9Ac2d2a4e";
    arbMonitorWss =
        "wss://opt-goerli.g.alchemy.com/v2/ujuLqrVg0LpzlYy_Lqu4Hjrq4T3rA6Ss";
    arbMonitorHttps =
        "https://opt-goerli.g.alchemy.com/v2/ujuLqrVg0LpzlYy_Lqu4Hjrq4T3rA6Ss";
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
const arbProviderWss = new ethers_1.ethers.providers.WebSocketProvider(arbMonitorWss);
exports.arbProviderWss = arbProviderWss;
const arbProviderHttps = new ethers_1.ethers.providers.StaticJsonRpcProvider(arbMonitorHttps);
exports.arbProviderHttps = arbProviderHttps;
const opIface = new ethers_1.ethers.utils.Interface(contractABI);
exports.opIface = opIface;
const opChainId = arbProviderHttps
    .getNetwork()
    .then((network) => network.chainId);
exports.opChainId = opChainId;
const opContract = new ethers_1.ethers.Contract(arbContractAddress, contractABI, arbProviderHttps);
exports.opContract = opContract;
