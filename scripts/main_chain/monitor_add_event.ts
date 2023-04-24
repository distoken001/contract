import { ethers } from "ethers";
import { Status } from "./enum_all";
import { insertLog } from "./logic_insert_log";
import { opContractAddress, opProviderWss, opIface, opChainId } from "./config";

async function op_monitor_add_event() {
  console.log("function:op_monitor_event  is loading");
  const topic1 = ethers.utils.id("AddOrder(address,uint256)");
  const topic2 = ethers.utils.id("Confirm(address,uint256)");
  const topic3 = ethers.utils.id("SetStatus(address,uint256,uint8)");
  let filters = [
    {
      address: opContractAddress,
      topics: [topic1],
    },
    {
      address: opContractAddress,
      topics: [topic2],
    },
    {
      address: opContractAddress,
      topics: [topic3],
    },
  ];
  filters.forEach((filter) => {
    opProviderWss.on(filter, async (result) => {
      console.log(result);
      let transactionHashsh: string = result.transactionHash;
      let blockHash: string = result.blockHash;
      let contractAddress: string = result.address;
      const data = result.data;
      const topics = result.topics;
      const resultParse = opIface.parseLog({ data, topics });
      console.log(
        "Parse Log Data op_monitor_event->resultParse->",
        resultParse
      );

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
      insertLog(
        eventName,
        operater,
        orderId,
        data,
        status,
        transactionHashsh,
        await opChainId
      );
    });
  });
}
export { op_monitor_add_event };
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
