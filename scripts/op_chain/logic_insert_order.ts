import { executeQuery } from "./db";

export const insertOrder = async (
    orderId: number,
    name: string,
    desc: string,
    amount: number,
    price: number,
    img: string,
    sellerPledge: number,
    buyerPledge: number,
    //sellerContact: string,
    //buyerContact: string,
    status: number,
    creator: string,
    updater: string,
    seller: string,
    buyer: string,
    token:string,
    chainId :number,
    buyerEx:number,
    contract:string,
    decimals :number
  ) => {
    const create_time = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });;
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
      orderId,
      name,
      desc,
      amount,
      price,
      img,
      sellerPledge,
      buyerPledge,
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
      chainId,
      buyerEx,
      contract,
      decimals
    ];
    const [rows, fields] = await executeQuery (sql, values);
    return [rows,fields];
  }