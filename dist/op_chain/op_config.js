"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opIface = exports.opContract = exports.opChainId = exports.opProviderHttps = exports.opProviderWss = exports.contractABI = exports.dbConfig = exports.opContractAddress = void 0;
const ethers_1 = require("ethers");
const contractABI = require("../../artifacts/contracts/Ebay.sol/Ebay.json").abi;
exports.contractABI = contractABI;
let opContractAddress = process.env.OP_CONTRACT_ADDRESS;
exports.opContractAddress = opContractAddress;
let opMonitorWss = process.env.API_WSS_OP;
let opMonitorHttps = process.env.API_HTTP_OP;
// 将 JSON 字符串解析为对象
const dbConfig = JSON.parse(process.env.DB_CONFIG);
exports.dbConfig = dbConfig;
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
