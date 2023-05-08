import { ethers } from "ethers";
import {
  opContractAddress,
  contractABI,
  opProviderHttps,
  opChainId,
  tokenContractABI,
  opContract,
  opIface,
  opProviderWss,
} from "./config";
import { insertOrder } from "./logic_insert_order";
async function op_monitor_add_order() {
  console.log("function:op_monitor_add_order is loading");
  const topic = ethers.utils.id(
    "AddOrder(address,uint256,unit8,address,address)"
  );
  let filter = {
    address: opContractAddress,
    topics: [topic],
  };
  opProviderWss.on(filter, async (result) => {
    console.log(result);
    const data = result.data;
    const topics = result.topics;
    const resultParse = opIface.parseLog({ data, topics });

    const _args = resultParse.args;
    console.log(
      "Parse Log Data op_monitor_add_order->resultParse->_args->",
      _args
    );
    const orderId = _args["orderId"].toNumber();
    const orderDetail = await opContract.orders(orderId);
    console.log("订单详情:", orderDetail);
    const token = orderDetail["token"];
    const tokenContract = new ethers.Contract(
      token,
      tokenContractABI,
      opProviderHttps
    );
    const decimals = await tokenContract.decimals();

    insertOrder(
      orderId,
      orderDetail["name"],
      orderDetail["description"],
      orderDetail["amount"].toNumber(),
      orderDetail["price"].toNumber(),
      orderDetail["img"],
      orderDetail["seller_pledge"].toNumber(),
      orderDetail["buyer_pledge"].toNumber(),
      //contactData["_seller"],
      //contactData["_buyer"],
      orderDetail["status"],
      "system",
      "system",
      orderDetail["seller"],
      orderDetail["buyer"],
      orderDetail["token"],
      await opChainId,
      orderDetail["buyer_ex"].toNumber(),
      opContractAddress,
      decimals
    );
  });
}
export { op_monitor_add_order };
