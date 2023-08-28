import mysql, {
  Pool,
  RowDataPacket,
  FieldPacket,
  OkPacket,
  ResultSetHeader,
} from "mysql2/promise";
const TronWeb = require("tronweb");
const dbConfig = {
  host: "sg-cdb-oey1gaf7.sql.tencentcdb.com",
  port: 63985,
  database: "ebay-dev",
  user: "dev",
  password: "Dev@1234",
};
const pool = mysql.createPool(dbConfig);
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey:
    "129c2019284e8ca1d49d5ac7c2a43c400c7c72fb2b1a7e3bfe64502381838e8a",
});
const contractAddress = "TJzUrGwomC8wNVZh8hCQ7FA8cCTCXCzNHt"; // 替换为目标合约地址
async function getOwnerOfNFT() {
  console.log("main start!!!");
  const abi = [
    "constructor(address)",
    "event Approval(address indexed,address indexed,uint256 indexed)",
    "event ApprovalForAll(address indexed,address indexed,bool)",
    "event OwnershipTransferred(address indexed,address indexed)",
    "event Transfer(address indexed,address indexed,uint256 indexed)",
    "function approve(address,uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function getApproved(uint256) view returns (address)",
    "function getTokenBalance() view returns (uint256)",
    "function isApprovedForAll(address,address) view returns (bool)",
    "function mint(address)",
    "function mintWithToken(uint256)",
    "function name() view returns (string)",
    "function owner() view returns (address)",
    "function ownerOf(uint256) view returns (address)",
    "function price() view returns (uint256)",
    "function renounceOwnership()",
    "function safeTransferFrom(address,address,uint256)",
    "function safeTransferFrom(address,address,uint256,bytes)",
    "function setApprovalForAll(address,bool)",
    "function setBaseURI(string)",
    "function setPrice(uint256)",
    "function setToken(address)",
    "function supportsInterface(bytes4) view returns (bool)",
    "function symbol() view returns (string)",
    "function tokenURI(uint256) view returns (string)",
    "function transferFrom(address,address,uint256)",
    "function transferOwnership(address)",
    "function withraw()",
  ];

  for (let i = 1; i < 4064; i++) {
    //     let instance = await tronWeb.contract(abi,'TJzUrGwomC8WNVZh8hC07FA8cCTCXCzNHt');
    //let res = await instance["owner0f"](1).call() ;
    // console.log(res);
    const contract = await tronWeb.contract().at(contractAddress);
    const addr = await contract.ownerOf(i).call();
    const owner=tronWeb.address.fromHex(addr);

    const sql = `
      INSERT INTO user_nft (
       address,nft,status,create_time,update_time,chain_id,contract
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [owner, i, 1, new Date(), new Date(), -1, contractAddress];
    const [rows, fields] = await executeQuery(sql, values);
    console.log("插入成功", i);
  }
}
getOwnerOfNFT();

async function executeQuery(
  query: string,
  values: any[] = []
): Promise<[RowDataPacket[], FieldPacket[]]> {
  const connection = await pool.getConnection();
  try {
    const result = await connection.execute(query, values);
    return result as [RowDataPacket[], FieldPacket[]];
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}
