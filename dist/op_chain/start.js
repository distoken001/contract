"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const op_monitor_add_order_1 = require("./op_monitor_add_order");
const op_monitor_event_1 = require("./op_monitor_event");
const op_monitor_order_status_1 = require("./op_monitor_order_status");
const op_config_1 = require("./op_config");
function main() {
    console.log("main start!!!");
    const iface = new ethers_1.ethers.utils.Interface(op_config_1.contractABI);
    const abiIntermediatorHuman = iface.format(ethers_1.ethers.utils.FormatTypes.minimal);
    console.log("abi:", abiIntermediatorHuman);
    (0, op_monitor_add_order_1.op_monitor_add_order)();
    (0, op_monitor_event_1.op_monitor_event)();
    (0, op_monitor_order_status_1.op_monitor_order_status)();
}
main();
