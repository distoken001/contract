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

 const topic = ethers.utils.id(
    "SetStatus(address,uint256,unit8,address,address)"
  );
  let filter = {
    address: opContractAddress,
    topics: [topic],
  };

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
      //const contactData = await opContract.getContact(orderId);
      console.log("订单详情：", orderDetail);
      //console.log("联系方式", contactData);
      UpdateStatus(
        orderId,
        orderDetail["status"],
        orderDetail["buyer"],
        orderDetail["buyer_ex"].toNumber(),
        orderDetail["buyer_pledge"].toNumber(),
        await opChainId
      );
    });
}
export { op_monitor_order_status };
