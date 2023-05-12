import { Status } from "./enum_all";
import { executeQuery } from "./db";

export async function logic_update_order(
  _order_id: number,
  _status: Status,
  _buyer: string,
  _buyer_ex: any,
  _buyer_pledge: any,
  _amount: any,
  _seller_pledge: any,
  _chain_id: number,
  _contract_address: string
) {
  const updateData = {
    order_id: _order_id,
    status: _status,
    update_time: new Date().toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
    }),
    updater: "system",
    creator: "system",
    buyer: _buyer,
    chain_id: _chain_id,
    buyer_ex: _buyer_ex.toString(),
    buyer_pledge: _buyer_pledge.toString(),
    seller_pledge: _seller_pledge.toString(),
    amount: _amount.toString(),
    contract_address: _contract_address,
  };

  if (updateData.status == Status.Ordered) {
    const query =
      "update orders SET status=?,buyer_ex=?,create_time=?, update_time=?,buyer= ?,buyer_pledge= ?,seller_pledge=?,amount=?  where order_id=? and chain_id=? and contract=?";

    const values = [
      updateData.status,
      updateData.buyer_ex,
      updateData.update_time,
      updateData.update_time,
      updateData.buyer,
      updateData.buyer_pledge,
      updateData.seller_pledge,
      updateData.amount,
      updateData.order_id,
      updateData.chain_id,
      updateData.contract_address,
    ];
    const [rows, fields] = await executeQuery(query, values);
    return [rows, fields];
  } else {
    const query =
      "update orders SET status=?,buyer_ex=?, update_time=?,buyer= ?,buyer_pledge= ?,seller_pledge=?,amount=?  where order_id=? and chain_id=? and contract=?";

    const values = [
      updateData.status,
      updateData.buyer_ex,
      updateData.update_time,
      updateData.buyer,
      updateData.buyer_pledge,
      updateData.seller_pledge,
      updateData.amount,
      updateData.order_id,
      updateData.chain_id,
      updateData.contract_address,
    ];
    const [rows, fields] = await executeQuery(query, values);
    return [rows, fields];
  }
}
