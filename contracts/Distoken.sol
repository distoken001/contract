// Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract USDT is IERC20 
{
    address owner;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;
    uint256 public  max=30000000000000000;   // 代币总供给
    uint256 public override totalSupply;   // 目前流通量
    string public name;   // 名称
    string public symbol;  // 代号
    uint8 public decimals; // 小数位数
    uint256 public released;//挖矿释放
    uint8 public isMiited=0;//项目方是否挖过
    uint256 public immutable start= block.timestamp; // 起始时间戳
    //ownerAddress 合约拥有人地址
    constructor(address ownerAddress ){
        name = "TetherUS";
        symbol = "USDT";
        decimals=6;
        owner=ownerAddress;
    }
    function transfer(address recipient, uint amount) external override returns (bool) 
    {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }
    function approve(address spender, uint amount) external override returns (bool) 
    {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external override returns (bool)
    {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
    function mechanismMint()  external onlyOwner
    {   
        uint256 amount=6000000000000000;
        require(totalSupply+amount<=max,"Exceeding the maximum circulation") ;
        require(isMiited==0,"Has been minted") ;
        isMiited=1;
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }
    function mint()  external returns(bool) 
    {
        uint256 releasable = (uint256(block.timestamp) -start)*100000000- released;
        require(totalSupply+releasable<=max,"Exceeding the maximum circulation") ;
        if(releasable>=1)
        {
          released+= releasable; 
          balanceOf[msg.sender] += releasable;
          totalSupply += releasable;
          emit Transfer(address(0), msg.sender, releasable);
          return true;
        }
        else
        {
          return false;
        }
    }
    function burn(uint amount) external 
    {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        max-=amount;
        emit Transfer(msg.sender, address(0), amount);
    }
    function getBalance() external view returns(uint balance)
    {
        balance = address(this).balance;
    }
    function changeOwner(address _newOwner) external onlyOwner
    {
      owner = _newOwner; 
    }
    modifier onlyOwner
    {
    require(msg.sender == owner, "Not owner"); 
    _; 
    }
    receive() external payable {}
}

