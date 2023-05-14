export enum Status{
    Initial,//待购买0
    Ordered,//被下单1
    Completed,//已完成2
    BuyerBreak,//卖家发货3
    SellerBreak,//卖家毁约4
    SellerCancelWithoutDuty,//卖家无责取消5
    BuyerLanchCancel,//买家发起取消6
    SellerLanchCancel,//卖家发起取消7
    SellerRejectCancel,//卖家拒绝取消8
    BuyerRejectCancel,//买家拒绝取消9
    ConsultCancelCompleted//协商取消完成10
  }    