import { ethers } from "ethers";
import { UpdateStatus } from "./logic_update_status";
import {
  opContractAddress,
  opProviderWss,
  opIface,
  opContract,
  opChainId
} from "./config";

async function op_monitor_order_status() {
  console.log("function:op_monitor_order_status is loading");

  const topic2 = ethers.utils.id("Confirm(address,uint256)");
  const topic3 = ethers.utils.id("SetStatus(address,uint256,uint8)");
  let filters = [
    {
      address: opContractAddress,
      topics: [topic2],
    },
    {
      address: opContractAddress,
      topics: [topic3],
    },
  ];
  filters.forEach((filter) => {
    opProviderWss.on(filter, async (result) => {
      //console.log(result);
      let transactionHashsh: string = result.transactionHash;
      let blockHash: string = result.blockHash;
      let contractAddress: string = result.address;
      const data = result.data;
      const topics = result.topics;
      const resultParse = opIface.parseLog({ data, topics });
      const _args = resultParse.args;

      let orderId: number = _args["orderId"].toNumber();
      const orderDetail = await opContract.orders(orderId);
      const contactData = await opContract.getContact(orderId);
      console.log("订单详情：", orderDetail);
      console.log("联系方式", contactData);
      UpdateStatus(
        contactData["_buyer"],
        contactData["_seller"],
        orderId,
        orderDetail["status"],
        orderDetail["buyer"],
        await opChainId
      );
    });
  });
}
export { op_monitor_order_status };
