import { ethers } from "ethers";
import { Status } from "./enum_all";
import { insertLog } from "./logic_insert_log";
import { contractAddress, providerWss, iface, chainId } from "./config";

async function monitor_add_event() {
  console.log("function:op_monitor_event  is loading");
  const topic1 = ethers.utils.id(
    "AddOrder(address,uint256,uint8,address,address)"
  );
  const topic2 = ethers.utils.id(
    "SetStatus(address,uint256,uint8,address,address)"
  );
  let filters = [
    {
      address: contractAddress,
      topics: [topic1],
    },
    {
      address: contractAddress,
      topics: [topic2],
    },
  ];
  filters.forEach((filter) => {
    providerWss.on(filter, async (result) => {
      console.log(result);
      let transactionHashsh: string = result.transactionHash;
      let blockHash: string = result.blockHash;
      let contractAddress: string = result.address;
      const data = result.data;
      const topics = result.topics;
      const resultParse = iface.parseLog({ data, topics });
      console.log(
        "Parse Log Data op_monitor_event->resultParse->",
        resultParse
      );

      const _args = resultParse.args;
      let eventName = resultParse.name;
      let operater = _args["defaulter"];
      let orderId = _args["orderId"].toNumber();
      let status = _args["status"];
      let seller = _args["seller"];
      let buyer = _args["buyer"];
      insertLog(
        eventName,
        operater,
        orderId,
        data,
        status,
        transactionHashsh,
        await chainId,
        seller,
        buyer
      );
    });
  });
}
export { monitor_add_event };
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
