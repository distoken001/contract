import { ethers } from "ethers";
import { monitor_add_order } from "./monitor_add_order";
import { monitor_add_event } from "./monitor_add_event";
import { monitor_order_change } from "./monitor_order_change";
import { contractABI } from "./config";
function main() {
  console.log("main start!!!");
  const iface = new ethers.utils.Interface(contractABI);
  const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
  console.log("abi:", abiIntermediatorHuman);
  monitor_add_order();
  monitor_add_event();
  monitor_order_change();
}
main();
