const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('wss://eth-goerli.g.alchemy.com/v2/2bqhAwakMpyvwmP4PggpuhBgOJWVmbfh');

const contractAddress = '0x23fa94Cf32fef67e19B39b4E90637bC7D3000621';
const contractABI =  require("./intermediator.json")

const contract = new ethers.Contract(contractAddress, contractABI, provider);

contract.on('CreateOrder', (seller, orderId,  event) => {
   console.log(`Transfer event received: seller=${seller}, orderId=${orderId}, event=${event}`);
});

contract.provider.pollingInterval = 5000; // 设置轮询间隔时间（毫秒）
contract.listenerCount('CreateOrder') // 查看当前监听人数 
// contract.connect().then(() => {
//    console.log('Listening for CreateOrder events...');
// });
console.log("---------------")