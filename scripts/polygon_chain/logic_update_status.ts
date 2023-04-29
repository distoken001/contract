import { Status } from "./enum_all";
import { executeQuery } from "./db";

export async function UpdateStatus(
  _order_id: number,
  _status: Status,
  _buyer: string,
  _buyer_ex:number,
  _buyer_pledge:number,
  _chain_id :number
) {
  const updateData = {
    order_id: _order_id,
    status: _status,
    create_time: new Date(),
    update_time: new Date(),
    updater: "system",
    creator: "system",
    buyer: _buyer,
    chain_id:_chain_id,
    buyer_ex:_buyer_ex,
    buyer_pledge:_buyer_pledge
  };
  const query =
    "update orders SET status=?,buyer_ex=?, update_time=?,buyer= ?,buyer_pledge= ?  where order_id=? and chain_id=?";

  const values = [
    updateData.status,
    updateData.buyer_ex,
    updateData.update_time,
    updateData.buyer,
    updateData.buyer_pledge,
    updateData.order_id,
    updateData.chain_id
  ];

  const [rows, fields] = await executeQuery(query, values);
  return [rows, fields];
}
