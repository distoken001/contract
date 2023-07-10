export enum Status{
  Initial, //初始化
  Bid, //已经有拍的
  End, //已经结束
  Completed, //已完成
  ConfirmShip, //卖家发货
  SellerBreak, //卖家毁约
  SellerCancelWithoutDuty, //卖家无责取消
  ConsultCancelCompleted //协商取消完成
  }    