import { ethers } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
const {time, loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
import pgPromise from 'pg-promise';
import { config } from "./mysqlconfig";
async function insert( _event_name: string,
  _operater:string,
  _order_id:string,
  _data:string,
  _status:Status,
  _updater:string,
  _hash:string) {
  const pgp = pgPromise();
  const db = pgp(config);   
  try {
  // 插入数据
  const insertData = {
  event_name:_event_name,
  operater:_operater,
  order_id:_order_id,
  data:_data,
  status:_status,
  create_time:new Date(),
  update_time:new Date(),
  updater:_updater,
  creator:_updater,
  hash:_hash
  };

  await db.none('INSERT INTO public.event_logs ( event_name, operater, order_id, data, status, create_time, update_time, updater, creator, hash) VALUES ( ${event_name}, ${operater}, ${order_id}, ${data}, ${status}, ${create_time}, ${update_time}, ${updater}, ${creator}, ${hash}) ', insertData);

  // 查询数据
  //const users = await db.any('SELECT * FROM users');
  //console.log(users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // 关闭数据库连接
    pgp.end();
  }
}

enum Status{
    Initial,//待购买0
    Ordered,//被下单1
    Completed,//已完成2
    BuyerBreak,//买家毁约3
    SellerBreak,//卖家毁约4
    SellerCancelWithoutDuty,//卖家无责取消5
    BuyerLanchCancel,//买家发起取消6
    SellerLanchCancel,//卖家发起取消7
    SellerRejectCancel,//卖家拒绝取消8
    BuyerRejectCancel,//买家拒绝取消9
    ConsultCancelCompleted//协商取消完成10
  }      
async function main() {
    const provider = new ethers.providers.WebSocketProvider("wss://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ");
    let contractAddress = "0xE17906ED61fC2A1c9F290A15C14e6120A2FEf556"; 
    //引入ABI原始文件或是格式化后的ABI文件
    const abiIntermediatorRouter = require('../artifacts/contracts/Ebay.sol/Ebay.json').abi;
    const iface = new ethers.utils.Interface(abiIntermediatorRouter);
    const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
    console.log(abiIntermediatorHuman);
      
    const topic1 = ethers.utils.id("AddOrder(address,uint256)");
    const topic2 = ethers.utils.id("Confirm(address,uint256)");
    const topic3 = ethers.utils.id("Place(address,uint256)");
    const topic4 = ethers.utils.id("SetStatus(address,uint256,uint8)");
    //const topic5 = ethers.utils.id("OwnershipTransferred(address,address)");
    console.log(topic1,topic2,topic3,topic4);
    let filters = [{
    address: contractAddress,
    topics: [topic1]
    },{
    address: contractAddress,
    topics: [topic2]
    },{
    address: contractAddress,
    topics: [topic3]},
    {
    address: contractAddress,
    topics: [topic4]},
    ];
    filters.forEach((filter) => {
    provider.on(filter, async (result) => {
    console.log(result);
    let transactionHashsh:string=result.transactionHash;
    console.log("Parse Log Data->",transactionHashsh);
    let blockHash:string =result.blockHash;
    console.log("Parse Log Data->",blockHash);
    let contractAddress:string=result.address;
    console.log("Parse Log Data->",contractAddress);
    const data = result.data;
    const topics =result.topics;
    console.log("Parse Log Data->", iface.parseLog({ data, topics }));
    const resultParse= iface.parseLog({ data, topics });
    let eventName :string="";
    let creator:string="";
    let updator:string="";
    let operater:string="";
    let createTime:Date= new Date();
    let status :Status=Status.Initial;
    let orderId:string="";
    switch (resultParse.topic)
    {
    case topic1:  
    const _args = resultParse.args;
    eventName =resultParse.name;
    creator =_args["seller"];
    updator=creator;
    operater=creator;
    status=Status.Initial;
    orderId=_args["orderId"].toNumber();
    break;
    case topic2:
    {
      const _args = resultParse.args;
      eventName =resultParse.name;
      creator =_args["buyner"];
      updator=creator;
      operater=creator;
      status=Status.Completed;
      orderId=_args["orderId"].toNumber();
      break;
    }
    case topic3:
    {
      const _args = resultParse.args;
      eventName =resultParse.name;
      creator =_args["buyer"];
      updator=creator;
      operater=creator;
      status=Status.Ordered;
      orderId=_args["orderId"].toNumber();
      break;
    }
    case topic4:
    {
      const _args = resultParse.args;
      eventName =resultParse.name;
      creator =_args["defaulter"];
      updator=creator;
      operater=creator;
      status=_args["status"];
      orderId=_args["orderId"].toNumber();
      break;
    }}
    insert(eventName,operater,orderId,data,status,updator,transactionHashsh);
  
});
});
}
main();
    //console.log("Parse Log Data Args->", iface.parseLog({ data, topics }).args[1]);
    //let aaa=ethers.utils.formatEther(iface.parseLog({ data, topics }).args[1]);
    //console.log("Parse Log Data Args->", aaa);
    //console.log("Parse Log Data Args->", iface.parseLog({ data, topics }).args[5]);
    // console.log("Parse Log Data Args Order->", iface.parseLog({ data, topics }).args.values());

    //const _order = _args['order'];
    //const sellerPledgeQuantity =_order['sellerPledgeQuantity'].toNumber();



//insert("dfsaf","fds","","",1,1,"",1,"",Status.Initial,"","");
 /*
    provider.on("block", async (block) => {
        provider.on("pending",async(tx) =>{
           console.log(tx);
           const txDetail = await provider.getTransaction(tx);
            console.log(txDetail);
        });
    })*/
        //const encode = iface.encodeFunctionData("transfer",["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",100]);
    //Decode Function Data
    //const blockInfo = await provider.getBlock(result.blockNumber);
    //console.log(blockInfo);
    //const txDetail = await provider.getTransaction(result.transactionHash);
    //console.log(txDetail);
    //_args.map((_a,_i)=>{
    //console.log('-----------')
    //onsole.log(_i,_a);
    //})
    //    Object.keys(_args).map((_a,_i)=>{
    //     console.log('+++++++++++++++')
    //     console.log(_i,_a);
    //    })*/