module.exports = {
  apps: [
    {
      name: "monitor_op_prodb",
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
      name: "monitor_arb_prodb",
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
      name: "monitor_polygon_prodb",
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
      name: "monitor_avax_prodb",
      script: "node ./dist/ebay/master/v1/avax_chain/start.js",
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
      name: "monitor_bsc_prodb",
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
    {
      name: "v2_monitor_conflux_prodb",
      script: "node ./dist/ebay/master/v2/conflux_chain/start.js",
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
      name: "v2_monitor_op_prodb",
      script: "node ./dist/ebay/master/v2/op_chain/start.js",
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
      name: "v2_monitor_arb_prodb",
      script: "node ./dist/ebay/master/v2/arb_chain/start.js",
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
      name: "v2_monitor_polygon_prodb",
      script: "node ./dist/ebay/master/v2/polygon_chain/start.js",
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
      name: "v2_monitor_avax_prodb",
      script: "node ./dist/ebay/master/v2/avax_chain/start.js",
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
      name: "v2_monitor_bsc_prodb",
      script: "node ./dist/ebay/master/v2/bsc_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      cron_restart: '0 0 * * *', // 每天午夜重启一次
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
  ],
};
