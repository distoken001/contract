import { ethers } from "ethers";
import { op_monitor_add_order } from "./op_monitor_add_order";
import { op_monitor_event } from "./op_monitor_event";
import { op_monitor_order_status } from "./op_monitor_order_status";
import { contractABI, opContractAddress, monitorWss } from "./op_config";
function main() {
  console.log("main start!!!");
  const provider = new ethers.providers.WebSocketProvider(monitorWss);
  const iface = new ethers.utils.Interface(contractABI);
  const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
  console.log("abi:", abiIntermediatorHuman);
  op_monitor_add_order();
  op_monitor_event();
  op_monitor_order_status();
}
main();
