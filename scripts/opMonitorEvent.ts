import { ethers } from "ethers";
import { string } from "hardhat/internal/core/params/argumentTypes";
import { Status } from "./enumAll";
import { insert } from "./insertlog";

async function main() {
  const provider = new ethers.providers.WebSocketProvider(
    "wss://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ"
  );
  let contractAddress = "0xE17906ED61fC2A1c9F290A15C14e6120A2FEf556";
  //引入ABI原始文件或是格式化后的ABI文件
  const abiIntermediatorRouter =
    require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
  const iface = new ethers.utils.Interface(abiIntermediatorRouter);
  //const abiIntermediatorHuman = iface.format(ethers.utils.FormatTypes.minimal);
  //console.log(abiIntermediatorHuman);

  const topic1 = ethers.utils.id("AddOrder(address,uint256)");
  const topic2 = ethers.utils.id("Confirm(address,uint256)");
  const topic3 = ethers.utils.id("SetStatus(address,uint256,uint8)");
  //const topic5 = ethers.utils.id("OwnershipTransferred(address,address)");
  console.log(topic1, topic2, topic3);
  let filters = [
    {
      address: contractAddress,
      topics: [topic1],
    },
    {
      address: contractAddress,
      topics: [topic2],
    },
    {
      address: contractAddress,
      topics: [topic3],
    },
  ];
  filters.forEach((filter) => {
    provider.on(filter, async (result) => {
      console.log(result);
      let transactionHashsh: string = result.transactionHash;
      console.log("Parse Log Data->", transactionHashsh);
      let blockHash: string = result.blockHash;
      console.log("Parse Log Data->", blockHash);
      let contractAddress: string = result.address;
      console.log("Parse Log Data->", contractAddress);
      const data = result.data;
      const topics = result.topics;
      console.log("Parse Log Data->", iface.parseLog({ data, topics }));
      const resultParse = iface.parseLog({ data, topics });
      let eventName: string = "";
      let operater: string = "";
      let status: Status = Status.Initial;
      let orderId: string = "";
      switch (resultParse.topic) {
        case topic1:
          const _args = resultParse.args;
          eventName = resultParse.name;
          operater = _args["seller"];
          status = Status.Initial;
          orderId = _args["orderId"].toNumber();
          break;
        case topic2: {
          const _args = resultParse.args;
          eventName = resultParse.name;
          operater = _args["buyer"];
          status = Status.Completed;
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
      console.log(
        eventName,
        operater,
        orderId,
        data,
        status,
        transactionHashsh
      );
      insert(eventName, operater, orderId, data, status, transactionHashsh);
    });
  });
}
main();
