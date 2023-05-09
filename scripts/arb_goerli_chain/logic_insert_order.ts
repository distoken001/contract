import { executeQuery } from "./db";

export const insertOrder = async (
    order_id: number,
    name: string,
    desc: string,
    amount: number,
    price: number,
    img: string,
    seller_pledge: number,
    buyer_pledge: number,
    //sellerContact: string,
    //buyerContact: string,
    status: number,
    creator: string,
    updater: string,
    seller: string,
    buyer: string,
    token:string,
    chain_id :number,
    buyer_ex:number,
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
      amount,
      price,
      img,
      seller_pledge,
      buyer_pledge,
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
      buyer_ex,
      contract,
      decimals
    ];
    const [rows, fields] = await executeQuery (sql, values);
    return [rows,fields];
  }