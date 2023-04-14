import mysql, { Pool, RowDataPacket, FieldPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';
import { dbConfig } from './op_config';

const pool = mysql.createPool(dbConfig);

async function executeQuery(query: string, values: any[] = []): Promise<[RowDataPacket[], FieldPacket[]]> {
  const connection = await pool.getConnection();
  try {
    const result = await connection.execute(query, values);
    return result as [RowDataPacket[], FieldPacket[]];
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function executeTransaction(
    queries: { query: string; values: any[] }[]
  ): Promise<(RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader)[]> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const results: (RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader)[] = [];
      for (const { query, values } of queries) {
        const [result] = await connection.query(query, values);
        results.push(result as RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader);
      }
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
async function closePool() {
  await pool.end();
}

export { executeQuery, executeTransaction, closePool };