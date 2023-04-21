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
exports.UpdateStatus = void 0;
const db_1 = require("./db");
function UpdateStatus(_buyner_contract, _seller_contract, _order_id, _status, _buyer, _chain_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateData = {
            order_id: _order_id,
            status: _status,
            create_time: new Date(),
            update_time: new Date(),
            updater: "system",
            creator: "system",
            buyer_contact: _buyner_contract,
            seller_contact: _seller_contract,
            buyner: _buyer,
            chain_id: _chain_id
        };
        const query = "update orders SET status=?, update_time=?, buyer_contact=?, seller_contact=?,buyer= ?  where order_id=? and chain_id=?";
        const values = [
            updateData.status,
            updateData.update_time,
            updateData.buyer_contact,
            updateData.seller_contact,
            updateData.buyner,
            updateData.order_id,
            updateData.chain_id
        ];
        const [rows, fields] = yield (0, db_1.executeQuery)(query, values);
        return [rows, fields];
    });
}
exports.UpdateStatus = UpdateStatus;
