import { executeQuery } from "./db";
import { ethers } from "ethers";
export const insertOrder = async (
    order_id: number,
    name: string,
    desc: string,
    amount: any,
    price: any,
    img: string,
    seller_pledge: any,
    buyer_pledge: any,
    //sellerContact: string,
    //buyerContact: string,
    status: number,
    creator: string,
    updater: string,
    seller: string,
    buyer: string,
    token:string,
    chain_id :number,
    buyer_ex:any,
    contract:string,
    decimals :number
  ) => {
    const create_time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const update_time = create_time;
  
    const sql = `
      INSERT INTO orders (
        order_id,
        name,
        description,
        amount,
        price,
        img,
        seller_pledge,
        buyer_pledge,
        status,
        create_time,
        update_time,
        updater,
        creator,
        seller,
        buyer,
        token,
        chain_id,
        buyer_ex,
        contract,
        decimals
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;
  
    const values = [
      order_id,
      name,
      desc,
      amount.toString(),
      price.toString(),
      img,
      seller_pledge.toString(),
      buyer_pledge.toString(),
      //sellerContact,
      //buyerContact,
      status,
      create_time,
      update_time,
      updater,
      creator,
      seller,
      buyer,
      token,
      chain_id,
      buyer_ex.toString(),
      contract,
      decimals
    ];
    const [rows, fields] = await executeQuery (sql, values);
    return [rows,fields];
  }