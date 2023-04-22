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
exports.op_monitor_order_status = void 0;
const ethers_1 = require("ethers");
const logic_update_status_1 = require("./logic_update_status");
const config_1 = require("./config");
function op_monitor_order_status() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("function:op_monitor_order_status is loading");
        const topic2 = ethers_1.ethers.utils.id("Confirm(address,uint256)");
        const topic3 = ethers_1.ethers.utils.id("SetStatus(address,uint256,uint8)");
        let filters = [
            {
                address: config_1.opContractAddress,
                topics: [topic2],
            },
            {
                address: config_1.opContractAddress,
                topics: [topic3],
            },
        ];
        filters.forEach((filter) => {
            config_1.opProviderWss.on(filter, (result) => __awaiter(this, void 0, void 0, function* () {
                //console.log(result);
                let transactionHashsh = result.transactionHash;
                let blockHash = result.blockHash;
                let contractAddress = result.address;
                const data = result.data;
                const topics = result.topics;
                const resultParse = config_1.opIface.parseLog({ data, topics });
                const _args = resultParse.args;
                let orderId = _args["orderId"].toNumber();
                const orderDetail = yield config_1.opContract.orders(orderId);
                const contactData = yield config_1.opContract.getContact(orderId);
                console.log("订单详情：", orderDetail);
                console.log("联系方式", contactData);
                (0, logic_update_status_1.UpdateStatus)(contactData["_buyer"], contactData["_seller"], orderId, orderDetail["status"], orderDetail["buyer"], yield config_1.opChainId);
            }));
        });
    });
}
exports.op_monitor_order_status = op_monitor_order_status;
