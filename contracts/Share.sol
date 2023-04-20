// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract Share is PaymentSplitter, Ownable {
    //松年45 、智超20、金波10 、瑞刚10、洪建5、王超5、亚雄5
    address[] public _init_payees =[0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db,0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB];
    uint256[] public _init_shares =[20,30,50];
    constructor() PaymentSplitter(_init_payees,_init_shares) {
    }
}