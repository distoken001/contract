import { Status } from "./enum_all";
import { executeQuery } from "./db";
import { sendemail } from "./send_email";

export async function logic_update_order(
  _order_id: number,
  _status: Status,
  _buyer: string,
  _buyer_ex: any,
  _buyer_pledge: any,
  _price: any,
  _seller_pledge: any,
  _end_time:any,
  orderBidCount:number,
  _chain_id: number,
  _contract_address: string
) {
  const updateData = {
    order_id: _order_id,
    status: _status,
    update_time: new Date(),
    updater: "system",
    creator: "system",
    buyer: _buyer,
    chain_id: _chain_id,
    buyer_ex: _buyer_ex.toString(),
    buyer_pledge: _buyer_pledge.toString(),
    seller_pledge: _seller_pledge.toString(),
    price: _price.toString(),
    contract_address: _contract_address,
    end_time:_end_time.toString(),
    orderBidCount:orderBidCount
  };
  const query =
    "update orders_auction SET status=?,buyer_ex=?, update_time=?,buyer= ?,buyer_pledge= ?,seller_pledge=?,price=?,end_time=?, count=? where order_id=? and chain_id=? and contract=?";

  const values = [
    updateData.status,
    updateData.buyer_ex,
    updateData.update_time,
    updateData.buyer,
    updateData.buyer_pledge,
    updateData.seller_pledge,
    updateData.price,
    updateData.end_time,
    updateData.orderBidCount,
    updateData.order_id,
    updateData.chain_id,
    updateData.contract_address,
  ];
  const [rows, fields] = await executeQuery(query, values);
  // sendemail(
  //   updateData.chain_id,
  //   updateData.contract_address,
  //   updateData.order_id
  // );
  return [rows, fields];
}
