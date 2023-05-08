import { ethers } from "ethers";
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
}
const contractABI = require("../../artifacts/contracts/Ebay.sol/Ebay.json").abi;
const tokenContractABI = require("../../artifacts/contracts/Token.sol/Token.json").abi;
let opContractAddress: string = process.env.OP_GOERLI_CONTRACT_ADDRESS!;
let opMonitorWss: string = process.env.API_WSS_OP_GOERLI!;
let opMonitorHttps: string = process.env.API_HTTP_OP_GOERLI!;
// 将 JSON 字符串解析为对象
const dbConfig = JSON.parse(process.env.DB_CONFIG!);
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
  tokenContractABI
};
