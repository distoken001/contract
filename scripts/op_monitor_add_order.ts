import { ethers } from "ethers";
import { contractAddressCommon, monitorWss } from "./op_config";
async function op_monitor_add_order() {
  console.log("function:op_monitor_add_order is loading");
  const provider = new ethers.providers.WebSocketProvider(monitorWss);
  let contractAddress = contractAddressCommon;
  //引入ABI原始文件或是格式化后的ABI文件
  const contractABI = require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
  const iface = new ethers.utils.Interface(contractABI);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const topic1 = ethers.utils.id("AddOrder(address,uint256)");
  let filters = [
    {
      address: contractAddress,
      topics: [topic1],
    },
  ];
  filters.forEach((filter) => {
    provider.on(filter, async (result) => {
      console.log(result);
      const data = result.data;
      const topics = result.topics;
      console.log("Parse Log Data->", iface.parseLog({ data, topics }));
      const resultParse = iface.parseLog({ data, topics });
      const _args = resultParse.args;
      const orderId = _args["orderId"].toNumber();
      const orderDetail = await contract.orders(orderId);
      console.log(orderDetail);
      const contact = await contract.getContact(orderId);
      console.log(contact);
      // insertOrder(orderDetail["name"],orderDetail["description"],orderDetail["amount"],orderDetail["price"],orderDetail["img"],orderDetail);
    });
  });
}
export {op_monitor_add_order};
