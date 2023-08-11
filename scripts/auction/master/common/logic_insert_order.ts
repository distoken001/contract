import { executeQuery } from "./db";
import { ethers } from "ethers";
import { sendemail } from "./send_email";
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
    decimals :number,
    start_time:any,
    end_time:any
  ) => {
    const create_time = new Date();
    const update_time = create_time;
  
    const sql = `
      INSERT INTO orders_auction (
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
        decimals,
        start_time,
        end_time
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
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
      decimals,
      start_time.toString(),
      end_time.toString()
    ];
    const [rows, fields] = await executeQuery (sql, values);
    // sendemail(chain_id,contract,order_id);
    return [rows,fields];
  }