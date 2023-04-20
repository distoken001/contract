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
const op_config_1 = require("./op_config");
function op_monitor_order_status() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("function:op_monitor_order_status is loading");
        const contract = new ethers_1.ethers.Contract(op_config_1.opContractAddress, op_config_1.contractABI, op_config_1.providerWss);
        const topic2 = ethers_1.ethers.utils.id("Confirm(address,uint256)");
        const topic3 = ethers_1.ethers.utils.id("SetStatus(address,uint256,uint8)");
        let filters = [
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
                //console.log(result);
                let transactionHashsh = result.transactionHash;
                let blockHash = result.blockHash;
                let contractAddress = result.address;
                const data = result.data;
                const topics = result.topics;
                const resultParse = op_config_1.iface.parseLog({ data, topics });
                const _args = resultParse.args;
                let orderId = _args["orderId"].toNumber();
                const orderDetail = yield contract.orders(orderId);
                const contactData = yield contract.getContact(orderId);
                console.log("订单详情：", orderDetail);
                console.log("联系方式", contactData);
                (0, logic_update_status_1.UpdateStatus)(contactData["_buyer"], contactData["_seller"], orderId, orderDetail["status"], orderDetail["buyer"]);
            }));
        });
    });
}
exports.op_monitor_order_status = op_monitor_order_status;
