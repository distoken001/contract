module.exports = {
  apps: [
    {
      name: "ebay_op",
      script: " node ./dist/ebay/master/v1/op_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "ebay_arb",
      script: "node ./dist/ebay/master/v1/arb_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "ebay_polygon",
      script: "node ./dist/ebay/master/v1/polygon_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "ebay_bsc",
      script: "node ./dist/ebay/master/v1/bsc_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    // {
    //   name: "ebay_v2_op",
    //   script: "node ./dist/ebay/master/v2/op_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    // },
    // {
    //   name: "ebay_v2_arb",
    //   script: "node ./dist/ebay/master/v2/arb_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    // },
    // {
    //   name: "ebay_v2_polygon",
    //   script: "node ./dist/ebay/master/v2/polygon_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    // },
    // {
    //   name: "ebay_v2_bsc",
    //   script: "node ./dist/ebay/master/v2/bsc_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    // },
    // {
    //   name: "ebay_v2_conflux",
    //   script: "node ./dist/ebay/master/v2/conflux_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    // },
    // {
    //   name: "ebay_v2_avax",
    //   script: "node ./dist/ebay/master/v2/avax_chain/start.js",
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   cron_restart: '0 0 * * *', // 每天午夜重启一次
    //   max_memory_restart: "512M",
    //   env: {
    //     NODE_ENV: "production",
    //   },
    // }
  ],
};
