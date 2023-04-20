"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainId = void 0;
const { ethers } = require('ethers');
function getChainId(rpcUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        // 创建一个Ethers.js提供者来连接到侧链节点
        const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
        // 使用Ethers.js提供者来查询chain ID
        const chainId = yield provider.getNetwork().then((network) => network.chainId);
        return chainId;
    });
}
exports.getChainId = getChainId;
