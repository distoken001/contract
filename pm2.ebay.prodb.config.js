module.exports = {
  apps: [
    {
      name: "ebay_op_prodb",
      script: " node ./dist/ebay/master/v1/op_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "ebay_arb_prodb",
      script: "node ./dist/ebay/master/v1/arb_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "ebay_polygon_prodb",
      script: "node ./dist/ebay/master/v1/polygon_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "ebay_bsc_prodb",
      script: "node ./dist/ebay/master/v1/bsc_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    // {
    //   name: "ebay_v2_op_prodb",
    //   script: "node ./dist/ebay/master/v2/op_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "productionb",
    //   },
    // },
    // {
    //   name: "ebay_v2_arb_prodb",
    //   script: "node ./dist/ebay/master/v2/arb_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "productionb",
    //   },
    // },
    // {
    //   name: "ebay_v2_polygon_prodb",
    //   script: "node ./dist/ebay/master/v2/polygon_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "productionb",
    //   },
    // },
    // {
    //   name: "ebay_v2_bsc_prodb",
    //   script: "node ./dist/ebay/master/v2/bsc_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "productionb",
    //   },
    // },
    // {
    //   name: "ebay_v2_conflux_prodb",
    //   script: "node ./dist/ebay/master/v2/conflux_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "productionb",
    //   },
    // },
    // {
    //   name: "ebay_v2_avax_prodb",
    //   script: "node ./dist/ebay/master/v2/avax_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "productionb",
    //   },
    // }
  ],
};
