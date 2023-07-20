import { ethers } from "ethers";
import { logic_update_order } from "../../common/logic_update_order";
import {
  contractAddress,
  providerWss,
  iface,
  contract,
  chainId,
} from "./config";

async function monitor_order_change() {
  console.log("function:monitor_order_change is loading");

  const topic1 = ethers.utils.id(
    "SetOrderInfo(address,uint256,uint8,address,address)"
  );
  // const topic2 = ethers.utils.id(
  //   "UpdateEndTime(address,uint256,uint8,address,address)"
  // );
  let filters = [
    {
      address: contractAddress,
      topics: [topic1],
    },
    // {
    //   address: contractAddress,
    //   topics: [topic2],
    // },
  ];
  filters.forEach((filter) => {
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
      const orderTime = await contract.orderTime(orderId);
      const orderBidCount= await contract.orderBidCount(orderId).toNumber();
      console.log("修改拍卖订单->拍卖详情：", orderDetail);
      console.log("修改拍卖订单->拍卖时间：", orderTime);
      console.log("修改拍卖订单->拍卖次数：", orderBidCount);
      logic_update_order(
        orderId,
        orderDetail["status"],
        orderDetail["buyer"],
        orderDetail["buyer_ex"],
        orderDetail["buyer_pledge"],
        orderDetail["price"],
        orderDetail["seller_pledge"],
        orderTime["endTime"],
        orderBidCount,
        await chainId,
        contractAddress
      );
    });
  });
}
export { monitor_order_change };
