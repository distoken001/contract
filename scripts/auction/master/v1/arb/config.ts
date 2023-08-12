import { ethers } from "ethers";
const dotenv = require('dotenv');

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "productionb") {
  dotenv.config({ path: ".env.productionb" });
}
const contractABI = require("../../../../../artifacts/contracts/EnglishAuction.sol/EnglishAuction.json").abi;
const tokenContractABI =
  require("../../../../../artifacts/contracts/Token.sol/Token.json").abi;
let contractAddress: string = process.env.ARB_CONTRACT_ADDRESS_AUCTION!;
let monitorWss: string = process.env.API_WSS_ARB!;
let monitorHttps: string = process.env.API_HTTP_ARB!;
// 将 JSON 字符串解析为对象
const dbConfig = JSON.parse(process.env.DB_CONFIG!);
const providerWss = new ethers.providers.WebSocketProvider(monitorWss);
const providerHttps = new ethers.providers.StaticJsonRpcProvider(
  monitorHttps
);
const iface = new ethers.utils.Interface(contractABI);
const chainId = providerHttps
  .getNetwork()
  .then((network) => network.chainId);
const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  providerHttps
);
export {
  contractAddress,
  dbConfig,
  contractABI,
  providerWss,
  providerHttps,
  chainId,
  contract,
  iface,
  tokenContractABI
};
