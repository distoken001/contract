import { ethers } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
const {time, loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
import { pgDB } from './postgres';
import { BigNumber } from "alchemy-sdk";
import pgPromise from 'pg-promise';
import { config } from "./pgsql";
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
    const provider = new ethers.providers.WebSocketProvider("wss://scroll-alphanet.blastapi.io/2ea187fb-52f9-4dae-ba5b-c0c54a63c9c7");
    let contractAddress = "0x57cA528448212B40f2347fF941EdA213AAFefDB2"; 
    //引入ABI原始文件或是格式化后的ABI文件
    const abiIntermediatorRouter = require('../artifacts/contracts/Barter.sol/Barter.json').abi;
    const iface = new ethers.utils.Interface(abiIntermediatorRouter);
    const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
    console.log(abiIntermediatorHuman);
    const abi=[
        'constructor(uint256,uint256,uint256,address)',
        'event AddOrder(address indexed,uint256 indexed)',
        'event Confirm(address indexed,uint256 indexed)',
        'event OwnershipTransferred(address indexed,address indexed)',
        'event Place(address indexed,uint256 indexed)',
        'event SetStatus(address indexed,uint256 indexed,uint8 indexed)',
        'function addOrder(string,string,address,address,uint256,uint256,uint256)',
        'function buyerList(address,uint256) view returns (uint256)',
        'function buyerRate() view returns (uint256)',
        'function confirm(uint256)',
        'function confirmCancleOrder(uint256)',
        'function dateTime(uint256) view returns (uint256, uint256, uint256, uint256)',
        'function forced(uint256)',
        'function getContact(uint256) view returns (string, string)',
        'function launchCancleOrder(uint256)',
        'function lockAddr() view returns (address)',
        'function mortgageRatio() view returns (uint256)',
        'function orders(uint256) view returns (string, address, address, address, uint256, uint256, uint256, uint256, uint256, uint8)',
        'function owner() view returns (address)',
        'function place(uint256,string)',
        'function rejectCancleOrder(uint256)',
        'function renounceOwnership()',
        'function sellerList(address,uint256) view returns (uint256)',
        'function sellerRate() view returns (uint256)',
        'function setLock(address)',
        'function setRate(uint256,uint256,uint256)',
        'function total(address) view returns (uint256)',
        'function transferOwnership(address)'
      ]
      
    const topic1 = ethers.utils.id("AddOrder(address,uint256)");
    const topic2 = ethers.utils.id("Confirm(address,uint256)");
    const topic3 = ethers.utils.id("Place(address,uint256)");
    const topic4 = ethers.utils.id("SetStatus(address,uint256,uint8)");
    const topic5 = ethers.utils.id("OwnershipTransferred(address,address)");
    
    let filter = {
        address: contractAddress,
        topics: [topic1]
     }

    provider.on(filter, async (result) => {
    console.log(result);
    const data = result.data;
    const topics =result.topics;
    console.log("Parse Log Data->", iface.parseLog({ data, topics }));
    const resultParse= iface.parseLog({ data, topics });
    console.log(resultParse);
    const _args = resultParse.args;
    let transactionHashsh:string=result.transactionHash;
    console.log("Parse Log Data->",transactionHashsh);
    let blockHash:string =result.blockHash;
    console.log("Parse Log Data->",blockHash);
    let contractAddress:string=result.address;
    console.log("Parse Log Data->",contractAddress);
    let eventName =resultParse.name;
    console.log("Parse Log Data->",eventName);
    let creator:string =_args["seller"];
    console.log("Parse Log Data->",creator);
    let updator:string=creator;
    console.log("Parse Log Data->",updator);
    let operater:string =creator;
    console.log("Parse Log Data->",operater);
    let createTime:Date= new Date(Date.now());
    console.log("Parse Log Data->",createTime);
    let status :Status=Status.Initial;
    console.log("Parse Log Data->",status);
    let orderId:string=_args["orderId"].toNumber();
    console.log("Parse Log Data->",orderId);
    insert(eventName,operater,orderId,data,Status.Initial,updator,transactionHashsh);
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