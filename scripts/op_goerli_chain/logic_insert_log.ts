import { Status } from "./enum_all";
import { executeQuery } from "./db";

export async function insertLog(
  _event_name: string,
  _operater: string,
  _order_id: string,
  _data: string,
  _status: Status,
  _hash: string,
  _chain_id: number,
  _seller: string,
  _buyer: string,
  _contract_address:string
) {
  // 插入数据
  const insertData = {
    id: null,
    event_name: _event_name,
    operater: _operater,
    order_id: _order_id,
    data: _data,
    status: _status,
    create_time: new Date().toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
    }),
    update_time: new Date().toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
    }),
    updater: "system",
    creator: "system",
    hash: _hash,
    chain_id: _chain_id,
    seller: _seller,
    buyer: _buyer,
    contract_address:_contract_address
  };
  const query =
    "INSERT INTO event_logs SET id=?, event_name=?, operater=?, order_id=?, data=?, status=?, create_time=?, update_time=?, updater=?, creator=?, hash=?,chain_id=?,seller=?,buyer=?,contract=?";
  const values = [
    insertData.id,
    insertData.event_name,
    insertData.operater,
    insertData.order_id,
    insertData.data,
    insertData.status,
    insertData.create_time,
    insertData.update_time,
    insertData.updater,
    insertData.creator,
    insertData.hash,
    insertData.chain_id,
    insertData.seller,
    insertData.buyer,
    insertData.contract_address
  ];

  const [rows, fields] = await executeQuery(query, values);
  return [rows, fields];
}
