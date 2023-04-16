import { ethers } from "ethers";
import { UpdateStatus } from "./logic_update_status";
import { contractABI, contractAddressCommon, monitorWss } from "./op_config";

async function op_monitor_order_status() {
  console.log("function:op_monitor_order_status is loading");
  const provider = new ethers.providers.WebSocketProvider(monitorWss);
  let contractAddress = contractAddressCommon;
  const iface = new ethers.utils.Interface(contractABI);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const topic2 = ethers.utils.id("Confirm(address,uint256)");
  const topic3 = ethers.utils.id("SetStatus(address,uint256,uint8)");
  let filters = [
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
      //console.log(result);
      let transactionHashsh: string = result.transactionHash;
      let blockHash: string = result.blockHash;
      let contractAddress: string = result.address;
      const data = result.data;
      const topics = result.topics;
      const resultParse = iface.parseLog({ data, topics });
      const _args = resultParse.args;

      let orderId: number = _args["orderId"].toNumber();
      const orderDetail = await contract.orders(orderId);
      const contactData = await contract.getContact(orderId);
      console.log("订单详情：",orderDetail);
      console.log("联系方式",contactData);
      UpdateStatus(
        contactData["_buyer"],
        contactData["_seller"],
        orderId,
        orderDetail["status"],
        orderDetail["buyer"]
      );
    });
  });
}
export { op_monitor_order_status };
