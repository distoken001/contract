import { getConfigValue } from './getConfig';
const contractAddressCommon = "0x7Ea3Fb58959b0bbF66402a09d2cE3263b0B76b73";
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
