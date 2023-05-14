var WebSocket = require('ws');
var ws = new WebSocket('wss://shy-crimson-patina.avalanche-mainnet.discover.quiknode.pro/fdcc38a28efa02bf5ed2aba96af810bc26c2b5aa/ext/bc/C/ws');

ws.on('open', function open() {
  console.log('connected');
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function incoming(data) {
  console.log(`Received: ${data}`);
});

ws.on('error', function error(err) {
  console.log(`Error occurred: ${err.message}`);
});
