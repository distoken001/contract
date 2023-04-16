const contractAddressCommon = "0x6b7D575Be4576BB6fbd3E9A79ba718F0bf5aC767";
const monitorWss="wss://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
const monitorHttps="https://opt-goerli.g.alchemy.com/v2/sWBj_XQ2JLxUoY6emqWwigmtPa2roOXJ";
const contractABI = require("../artifacts/contracts/Ebay.sol/Ebay.json").abi;
const dbConfig= {
    host: '97.74.86.12',
    port: 3306,
    database: 'ebay',
    user: 'dev',
    password: 'Dev@1234',
  }
export { contractAddressCommon, monitorWss, dbConfig, monitorHttps,contractABI };
