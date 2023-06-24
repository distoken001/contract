import { ethers } from "ethers";
import {
  contractAddress,
  providerHttps,
  chainId,
  tokenContractABI,
  contract,
  iface,
  providerWss,
} from "./config";
import { insertOrder } from "../common/logic_insert_order";
async function monitor_add_order() {
  console.log("function:monitor_add_order is loading");
  const topic = ethers.utils.id(
    "AddOrder(address,uint256,uint8,address,address)"
  );
  let filter = {
    address: contractAddress,
    topics: [topic],
  };
  providerWss.on(filter, async (result) => {
    console.log(result);
    const data = result.data;
    const topics = result.topics;
    const resultParse = iface.parseLog({ data, topics });

    const _args = resultParse.args;
    console.log(
      "Parse Log Data monitor_add_order->resultParse->_args->",
      _args
    );
    const orderId = _args["orderId"].toNumber();
    const orderDetail = await contract.orders(orderId);
    console.log("订单详情:", orderDetail);
    const token = orderDetail["token"];
    const tokenContract = new ethers.Contract(
      token,
      tokenContractABI,
      providerHttps
    );
    const decimals = await tokenContract.decimals();

    insertOrder(
      orderId,
      orderDetail["name"],
      orderDetail["description"],
      orderDetail["amount"],
      orderDetail["price"],
      orderDetail["img"],
      orderDetail["seller_pledge"],
      orderDetail["buyer_pledge"],
      //contactData["_seller"],
      //contactData["_buyer"],
      orderDetail["status"],
      "system",
      "system",
      orderDetail["seller"],
      orderDetail["buyer"],
      orderDetail["token"],
      await chainId,
      orderDetail["buyer_ex"],
      contractAddress,
      decimals
    );
  });
}
export { monitor_add_order };
