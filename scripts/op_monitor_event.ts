import { ethers } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { Status } from "./enum_all";
import { insertLog } from "./logic_insert_log";
import { contractAddressCommon, monitorWss } from "./op_config";

async function main() {
  const provider = new ethers.providers.WebSocketProvider(monitorWss);
  let contractAddress = contractAddressCommon;
  //引入ABI原始文件或是格式化后的ABI文件
  const abiIntermediatorRouter =
    require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
  const iface = new ethers.utils.Interface(abiIntermediatorRouter);
  const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
  console.log(abiIntermediatorHuman);

  const topic1 = ethers.utils.id("AddOrder(address,uint256)");
  const topic2 = ethers.utils.id("Confirm(address,uint256)");
  const topic3 = ethers.utils.id("SetStatus(address,uint256,uint8)");
  //const topic5 = ethers.utils.id("OwnershipTransferred(address,address)");
  console.log(topic1, topic2, topic3);
  let filters = [
    {
      address: contractAddress,
      topics: [topic1],
    },
    {
      address: contractAddress,
      topics: [topic2],
    },
    {
      address: contractAddress,
      topics: [topic3],
    },
  ];
  filters.forEach((filter) => {
    provider.on(filter, async (result) => {
      console.log(result);
      let transactionHashsh: string = result.transactionHash;
      console.log("Parse Log Data->", transactionHashsh);
      let blockHash: string = result.blockHash;
      console.log("Parse Log Data->", blockHash);
      let contractAddress: string = result.address;
      console.log("Parse Log Data->", contractAddress);
      const data = result.data;
      const topics = result.topics;
      console.log("Parse Log Data->", iface.parseLog({ data, topics }));
      const resultParse = iface.parseLog({ data, topics });
      let eventName: string = "";
      let operater: string = "";
      let status: Status = Status.Initial;
      let orderId: string = "";
      switch (resultParse.topic) {
        case topic1:
          const _args = resultParse.args;
          eventName = resultParse.name;
          operater = _args["seller"];
          status = Status.Initial;
          orderId = _args["orderId"].toNumber();
          break;
        case topic2: {
          const _args = resultParse.args;
          eventName = resultParse.name;
          operater = _args["buyer"];
          status = Status.Completed;
          orderId = _args["orderId"].toNumber();
          break;
        }
        case topic3: {
          const _args = resultParse.args;
          eventName = resultParse.name;
          operater = _args["defaulter"];
          status = _args["status"];
          orderId = _args["orderId"].toNumber();
          break;
        }
      }
      console.log(
        eventName,
        operater,
        orderId,
        data,
        status,
        transactionHashsh
      );
      insertLog(eventName, operater, orderId, data, status, transactionHashsh);
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
