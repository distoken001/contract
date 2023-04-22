"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const monitor_add_order_1 = require("./monitor_add_order");
const monitor_event_1 = require("./monitor_event");
const monitor_status_1 = require("./monitor_status");
const config_1 = require("./config");
require('dotenv').config();
function main() {
    console.log("main start!!!");
    const iface = new ethers_1.ethers.utils.Interface(config_1.contractABI);
    const abiIntermediatorHuman = iface.format(ethers_1.ethers.utils.FormatTypes.minimal);
    console.log("abi:", abiIntermediatorHuman);
    (0, monitor_add_order_1.op_monitor_add_order)();
    (0, monitor_event_1.op_monitor_event)();
    (0, monitor_status_1.op_monitor_order_status)();
}
main();
