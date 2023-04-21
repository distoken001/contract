import { ethers } from "ethers";
import { op_monitor_add_order } from "./op_monitor_add_order";
import { op_monitor_event } from "./op_monitor_event";
import { op_monitor_order_status } from "./op_monitor_order_status";
import { contractABI } from "./op_config";
function main() {
  console.log("main start!!!");
  const iface = new ethers.utils.Interface(contractABI);
  const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
  console.log("abi:", abiIntermediatorHuman);
  op_monitor_add_order();
  op_monitor_event();
  op_monitor_order_status();
}
main();
