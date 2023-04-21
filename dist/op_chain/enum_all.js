"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Status;
(function (Status) {
    Status[Status["Initial"] = 0] = "Initial";
    Status[Status["Ordered"] = 1] = "Ordered";
    Status[Status["Completed"] = 2] = "Completed";
    Status[Status["BuyerBreak"] = 3] = "BuyerBreak";
    Status[Status["SellerBreak"] = 4] = "SellerBreak";
    Status[Status["SellerCancelWithoutDuty"] = 5] = "SellerCancelWithoutDuty";
    Status[Status["BuyerLanchCancel"] = 6] = "BuyerLanchCancel";
    Status[Status["SellerLanchCancel"] = 7] = "SellerLanchCancel";
    Status[Status["SellerRejectCancel"] = 8] = "SellerRejectCancel";
    Status[Status["BuyerRejectCancel"] = 9] = "BuyerRejectCancel";
    Status[Status["ConsultCancelCompleted"] = 10] = "ConsultCancelCompleted"; //协商取消完成10
})(Status = exports.Status || (exports.Status = {}));
