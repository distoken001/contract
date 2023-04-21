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
exports.insertOrder = void 0;
const db_1 = require("./db");
const insertOrder = (orderId, name, desc, amount, price, img, sellerPledge, buyerPledge, sellerContact, buyerContact, status, creator, updater, seller, buyer, token, chainId, buyerEx) => __awaiter(void 0, void 0, void 0, function* () {
    const create_time = new Date();
    const update_time = create_time;
    const sql = `
      INSERT INTO orders (
        order_id,
        name,
        description,
        amount,
        price,
        img,
        seller_pledge,
        buyer_pledge,
        seller_contact,
        buyer_contact,
        status,
        create_time,
        update_time,
        updater,
        creator,
        seller,
        buyer,
        token,
        chain_id,
        buyer_ex
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
    `;
    const values = [
        orderId,
        name,
        desc,
        amount,
        price,
        img,
        sellerPledge,
        buyerPledge,
        sellerContact,
        buyerContact,
        status,
        create_time,
        update_time,
        updater,
        creator,
        seller,
        buyer,
        token,
        chainId,
        buyerEx
    ];
    const [rows, fields] = yield (0, db_1.executeQuery)(sql, values);
    return [rows, fields];
});
exports.insertOrder = insertOrder;
