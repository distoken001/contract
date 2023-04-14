import { ethers } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { Status } from "./enum_all";
import { insertLog } from "./logic_insert_log";
import { FieldPacket, RowDataPacket } from "mysql2";
import { UpdateStatus } from "./logic_update_status";
import { contractAddressCommon, monitorWss } from "./op_config";

async function main() {
  const provider = new ethers.providers.WebSocketProvider(monitorWss);
  let contractAddress = contractAddressCommon;
  //引入ABI原始文件或是格式化后的ABI文件
  const contractABI = require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
  const iface = new ethers.utils.Interface(contractABI);
  //const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
  //console.log(abiIntermediatorHuman);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const topic1 = ethers.utils.id("AddOrder(address,uint256)");
  const topic2 = ethers.utils.id("Confirm(address,uint256)");
  const topic3 = ethers.utils.id("SetStatus(address,uint256,uint8)");
  //const topic5 = ethers.utils.id("OwnershipTransferred(address,address)");
  console.log(topic1, topic2, topic3);
  let filters = [
    {
      address: contractAddress,
      topics: [topic1],
    },
    {
      address: contractAddress,
      topics: [topic2],
    },
    {
      address: contractAddress,
      topics: [topic3],
    },
  ];
  filters.forEach((filter) => {
    provider.on(filter, async (result) => {
      console.log(result);
      let transactionHashsh: string = result.transactionHash;
      let blockHash: string = result.blockHash;
      let contractAddress: string = result.address;
      const data = result.data;
      const topics = result.topics;
      console.log("Parse Log Data->", iface.parseLog({ data, topics }));
      const resultParse = iface.parseLog({ data, topics });
      const _args = resultParse.args;
      let orderId: number = _args["orderId"].toNumber();
      const orderDetail = await contract.orders(orderId);
      const contacts = await contract.getContact(orderId);
      console.log(orderDetail);
      console.log(contacts);
      UpdateStatus(
        contacts["_buyer"],
        contacts["_seller"],
        orderId,
        orderDetail["status"]
      );
    });
  });
}
main();
