// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract SharePayment is PaymentSplitter, Ownable {
    address[] public _init_payees =[0xc69eC797d7e38A70Bcc9D2a5Ca1A3A64631AAe1C,0xb1B8a8E9c2FFcc0B2072937d170bAe4E794f6238,0xc93abD3762aed8E9823c787C542eD7Aede555e3C,0x44207d32b2b7af723d6035c069bC49DBEec589FF,0x45672EfA287D7E8DECDdd5B94Eee580f13493cc0,0x7568F2aD4b539e49e3A4f586867E13418EFc9541];
    uint256[] public _init_shares =[15,55,10,5,5,10];

    constructor() PaymentSplitter(_init_payees,_init_shares) {
    }

}