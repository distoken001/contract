import { ethers } from "ethers";
import { UpdateStatus } from "./logic_update_status";
import {
  contractAddress,
  providerWss,
  iface,
  contract,
  chainId
} from "./config";

async function monitor_order_change() {
  console.log("function:monitor_order_change is loading");

 const topic = ethers.utils.id(
    "SetStatus(address,uint256,uint8,address,address)"
  );
  let filter = {
    address: contractAddress,
    topics: [topic],
  };

    providerWss.on(filter, async (result) => {
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
      //const contactData = await contract.getContact(orderId);
      console.log("订单详情：", orderDetail);
      //console.log("联系方式", contactData);
      UpdateStatus(
        orderId,
        orderDetail["status"],
        orderDetail["buyer"],
        orderDetail["buyer_ex"].toNumber(),
        orderDetail["buyer_pledge"].toNumber(),
        orderDetail["amount"].toNumber(),
        orderDetail["seller_pledge"].toNumber(),
        await chainId
      );
    });
}
export { monitor_order_change };
