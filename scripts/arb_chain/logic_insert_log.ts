import {Status}  from  "./enum_all";
import { executeQuery } from "./db";

export async function insertLog( _event_name: string,
    _operater:string,
    _order_id:string,
    _data:string,
    _status:Status,
    _hash:string) {
    
    // 插入数据
    const insertData = {
      id: null,
      event_name: _event_name,
      operater: _operater,
      order_id: _order_id,
      data: _data,
      status: _status,
      create_time: new Date(),
      update_time: new Date(),
      updater: 'system',
      creator: 'system',
      hash: _hash
    };
    const query = 'INSERT INTO event_logs SET id=?, event_name=?, operater=?, order_id=?, data=?, status=?, create_time=?, update_time=?, updater=?, creator=?, hash=?';
  
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
      insertData.hash
    ];

    const [rows, fields] = await executeQuery (query, values);
    return [rows,fields];
  }