import { Status } from "./enum_all";
import { executeQuery } from "./db";

export async function UpdateStatus(
  _buyner_contract: string,
  _seller_contract: string,
  _order_id: number,
  _status: Status,
  _buyer: string
) {
  const updateData = {
    order_id: _order_id,
    status: _status,
    create_time: new Date(),
    update_time: new Date(),
    updater: "system",
    creator: "system",
    buyer_contact: _buyner_contract,
    seller_contact: _seller_contract,
    buyner: _buyer,
  };
  const query =
    "update orders SET status=?, update_time=?, buyer_contact=?, seller_contact=?,buyer= ?  where order_id=?";

  const values = [
    updateData.status,
    updateData.update_time,
    updateData.buyer_contact,
    updateData.seller_contact,
    updateData.buyner,
    updateData.order_id,
  ];

  const [rows, fields] = await executeQuery(query, values);
  return [rows, fields];
}
