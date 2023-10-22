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
  export enum ChainEnum 
  {
      Ethereum = 1,
      Arbitrum = 42161,
      Optimism = 10,
      Polygon = 137,
      Ropsten = 3,
      Rinkeby = 4,
      Goerli = 5,
      Kovan = 42,
      Bsc = 56,
      Sokol = 77,
      BscTestnet = 97,
      Xdai = 100,
      Heco = 100,
      Opera = 250,
      HecoTestnet = 256,
      OptimisticGoerli = 420,
      Moonbeam = 1284,
      Moonriver = 1285,
      MoonbaseAlpha = 1287,
      FtmTestnet = 4002,
      Chiado = 10200,
      AvalancheFujiTestnet = 43113,
      Avalanche = 43114,
      PolygonMumbai = 80001,
      ArbitrumTestnet = 421613,
      ArbitrumGoerli = 421613,
      Aepolia = 11155111,
      Aurora = 1313161554,
      AuroraTestnet = 1313161555,
      Harmony = 1666600000,
      HarmonyTest = 1666700000,
      Conflux = 1030
  }