"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.op_monitor_event = void 0;
const ethers_1 = require("ethers");
const enum_all_1 = require("./enum_all");
const logic_insert_log_1 = require("./logic_insert_log");
const op_config_1 = require("./op_config");
function op_monitor_event() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("function:op_monitor_event  is loading");
        const topic1 = ethers_1.ethers.utils.id("AddOrder(address,uint256)");
        const topic2 = ethers_1.ethers.utils.id("Confirm(address,uint256)");
        const topic3 = ethers_1.ethers.utils.id("SetStatus(address,uint256,uint8)");
        let filters = [
            {
                address: op_config_1.opContractAddress,
                topics: [topic1],
            },
            {
                address: op_config_1.opContractAddress,
                topics: [topic2],
            },
            {
                address: op_config_1.opContractAddress,
                topics: [topic3],
            },
        ];
        filters.forEach((filter) => {
            op_config_1.providerWss.on(filter, (result) => __awaiter(this, void 0, void 0, function* () {
                console.log(result);
                let transactionHashsh = result.transactionHash;
                let blockHash = result.blockHash;
                let contractAddress = result.address;
                const data = result.data;
                const topics = result.topics;
                const resultParse = op_config_1.iface.parseLog({ data, topics });
                console.log("Parse Log Data op_monitor_event->resultParse->", resultParse);
                let eventName = "";
                let operater = "";
                let status = enum_all_1.Status.Initial;
                let orderId = "";
                switch (resultParse.topic) {
                    case topic1:
                        const _args = resultParse.args;
                        eventName = resultParse.name;
                        operater = _args["seller"];
                        status = enum_all_1.Status.Initial;
                        orderId = _args["orderId"].toNumber();
                        break;
                    case topic2: {
                        const _args = resultParse.args;
                        eventName = resultParse.name;
                        operater = _args["buyer"];
                        status = enum_all_1.Status.Completed;
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
                (0, logic_insert_log_1.insertLog)(eventName, operater, orderId, data, status, transactionHashsh);
            }));
        });
    });
}
exports.op_monitor_event = op_monitor_event;
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
