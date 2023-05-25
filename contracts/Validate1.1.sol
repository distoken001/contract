// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Validate {
    enum Status {
        Initial, //待购买0
        Ordered, //被下单1
        Completed, //已完成2
        ConfirmShip, //确认发货3
        SellerBreak, //卖家毁约4
        SellerCancelWithoutDuty, //卖家无责取消5
        BuyerLanchCancel, //买家发起取消6
        SellerLanchCancel, //卖家发起取消7
        SellerRejectCancel, //卖家拒绝取消8
        BuyerRejectCancel, //买家拒绝取消9
        ConsultCancelCompleted //协商取消完成10
    }

    function adminValidateStatus(uint8 num) internal pure {
        Status status = Status(num);
        require(status != Status.Initial, "Status Initial");
        require(
            status != Status.ConsultCancelCompleted,
            "Status ConsultCancelCompleted"
        );
        require(status != Status.Completed, "Status Completed");
        require(
            status != Status.SellerCancelWithoutDuty,
            "Status SellerCancelWithoutDuty"
        );
        require(status != Status.SellerBreak, "Status SellerBreak");
    }

    function validateLaunchCancel(uint8 num) internal pure {
        Status status = Status(num);
        require(
            status == Status.Ordered ||
                status == Status.SellerRejectCancel ||
                status == Status.BuyerRejectCancel,
            "Order cannot be launched"
        );
    }

    function validateConfirm(uint8 num) internal pure {
        Status status = Status(num);
        require(status == Status.ConfirmShip, "Order cannot be confirmed");
    }

    function validateConfirmShip(uint8 num) internal pure {
        Status status = Status(num);
        require(
            status == Status.Ordered ||
                status == Status.SellerRejectCancel ||
                status == Status.BuyerRejectCancel ||
                status == Status.BuyerLanchCancel ||
                status == Status.SellerLanchCancel,
            "Order cannot be confirmed"
        );
    }
}
