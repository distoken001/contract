import { config } from "./mysqlconfig";
import mysql from 'mysql2/promise';
import {Status}  from  "./enumAll";

export async function insert( _event_name: string,
    _operater:string,
    _order_id:string,
    _data:string,
    _status:Status,
    _hash:string) {
    const connection = await mysql.createConnection(config);
    try {
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
    console.error('Insert Data :', insertData);
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
  
    const [rows, fields] = await connection.execute(query, values);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // 关闭数据库连接
     await connection.end();
    }
  }