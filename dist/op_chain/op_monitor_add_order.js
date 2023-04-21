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
exports.op_monitor_add_order = void 0;
const ethers_1 = require("ethers");
const op_config_1 = require("./op_config");
const logic_insert_order_1 = require("./logic_insert_order");
function op_monitor_add_order() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("function:op_monitor_add_order is loading");
        const iface = new ethers_1.ethers.utils.Interface(op_config_1.contractABI);
        const contract = new ethers_1.ethers.Contract(op_config_1.opContractAddress, op_config_1.contractABI, op_config_1.opProviderHttps);
        const topic1 = ethers_1.ethers.utils.id("AddOrder(address,uint256)");
        let filter = {
            address: op_config_1.opContractAddress,
            topics: [topic1],
        };
        op_config_1.opProviderHttps.on(filter, (result) => __awaiter(this, void 0, void 0, function* () {
            console.log(result);
            const data = result.data;
            const topics = result.topics;
            const resultParse = iface.parseLog({ data, topics });
            const _args = resultParse.args;
            console.log("Parse Log Data op_monitor_add_order->resultParse->_args->", _args);
            const orderId = _args["orderId"].toNumber();
            const orderDetail = yield contract.orders(orderId);
            console.log("订单详情:", orderDetail);
            const contactData = yield contract.getContact(orderId);
            console.log("联系方式:", contactData);
            (0, logic_insert_order_1.insertOrder)(orderId, orderDetail["name"], orderDetail["description"], orderDetail["amount"].toNumber(), orderDetail["price"].toNumber(), orderDetail["img"], orderDetail["seller_pledge"].toNumber(), orderDetail["buyer_pledge"].toNumber(), contactData["_seller"], contactData["_buyer"], orderDetail["status"], "system", "system", orderDetail["seller"], orderDetail["buyer"], orderDetail["token"], yield op_config_1.opChainId);
        }));
    });
}
exports.op_monitor_add_order = op_monitor_add_order;
