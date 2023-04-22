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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.executeTransaction = exports.executeQuery = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("./config");
const pool = promise_1.default.createPool(config_1.dbConfig);
function executeQuery(query, values = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield pool.getConnection();
        try {
            const result = yield connection.execute(query, values);
            return result;
        }
        catch (error) {
            throw error;
        }
        finally {
            connection.release();
        }
    });
}
exports.executeQuery = executeQuery;
function executeTransaction(queries) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield pool.getConnection();
        try {
            yield connection.beginTransaction();
            const results = [];
            for (const { query, values } of queries) {
                const [result] = yield connection.query(query, values);
                results.push(result);
            }
            yield connection.commit();
            return results;
        }
        catch (error) {
            yield connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    });
}
exports.executeTransaction = executeTransaction;
function closePool() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.end();
    });
}
exports.closePool = closePool;
