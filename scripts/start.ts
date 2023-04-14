import { ethers } from "hardhat";
import { op_monitor_add_order } from "./op_monitor_add_order";
import { op_monitor_event } from "./op_monitor_event";
import { op_monitor_order_status } from "./op_monitor_order_status";
import { contractAddressCommon, monitorWss } from "./op_config";
function main() {
  console.log("function _________main");
  const provider = new ethers.providers.WebSocketProvider(monitorWss);
  let contractAddress = contractAddressCommon;
  //引入ABI原始文件或是格式化后的ABI文件
  const abiIntermediatorRouter =
    require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
  const iface = new ethers.utils.Interface(abiIntermediatorRouter);
  const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
  console.log("abi:",abiIntermediatorHuman);
  op_monitor_add_order();
  op_monitor_event();
  op_monitor_order_status();
}
main();
