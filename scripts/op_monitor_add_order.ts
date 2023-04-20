import { ethers } from "ethers";
import {
  opContractAddress,
  monitorWss,
  monitorHttps,
  contractABI,
  providerHttps,
  providerWss,
  chainId,
} from "./op_config";
import { insertOrder } from "./logic_insert_order";
async function op_monitor_add_order() {
  console.log("function:op_monitor_add_order is loading");
  const iface = new ethers.utils.Interface(contractABI);
  const contract = new ethers.Contract(
    opContractAddress,
    contractABI,
    providerHttps
  );
  const topic1 = ethers.utils.id("AddOrder(address,uint256)");
  let filter = {
    address: opContractAddress,
    topics: [topic1],
  };
  providerWss.on(filter, async (result) => {
    console.log(result);
    const data = result.data;
    const topics = result.topics;
    const resultParse = iface.parseLog({ data, topics });

    const _args = resultParse.args;
    console.log(
      "Parse Log Data op_monitor_add_order->resultParse->_args->",
      _args
    );
    const orderId = _args["orderId"].toNumber();
    const orderDetail = await contract.orders(orderId);
    console.log("订单详情:", orderDetail);
    const contactData = await contract.getContact(orderId);
    console.log("联系方式:", contactData);
    insertOrder(
      orderId,
      orderDetail["name"],
      orderDetail["description"],
      orderDetail["amount"].toNumber(),
      orderDetail["price"].toNumber(),
      orderDetail["img"],
      orderDetail["seller_pledge"].toNumber(),
      orderDetail["buyer_pledge"].toNumber(),
      contactData["_seller"],
      contactData["_buyer"],
      orderDetail["status"],
      "system",
      "system",
      orderDetail["seller"],
      orderDetail["buyer"],
      orderDetail["token"],
      await chainId
    );
  });
}
export { op_monitor_add_order };
