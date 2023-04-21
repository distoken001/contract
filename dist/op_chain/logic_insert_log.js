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
exports.insertLog = void 0;
const db_1 = require("./db");
function insertLog(_event_name, _operater, _order_id, _data, _status, _hash) {
    return __awaiter(this, void 0, void 0, function* () {
        // 插入数据
        const insertData = {
            id: null,
            event_name: _event_name,
            operater: _operater,
            order_id: _order_id,
            data: _data,
            status: _status,
            create_time: new Date(),
            update_time: new Date(),
            updater: 'system',
            creator: 'system',
            hash: _hash
        };
        const query = 'INSERT INTO event_logs SET id=?, event_name=?, operater=?, order_id=?, data=?, status=?, create_time=?, update_time=?, updater=?, creator=?, hash=?';
        const values = [
            insertData.id,
            insertData.event_name,
            insertData.operater,
            insertData.order_id,
            insertData.data,
            insertData.status,
            insertData.create_time,
            insertData.update_time,
            insertData.updater,
            insertData.creator,
            insertData.hash
        ];
        const [rows, fields] = yield (0, db_1.executeQuery)(query, values);
        return [rows, fields];
    });
}
exports.insertLog = insertLog;
