module.exports = {
    apps: [
      {
        name: 'auction_bsc_prod_v1',
        script: ' node ./dist/auction/master/v1/bsc/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '216M',
        env: {
          NODE_ENV: 'production',
        }
      },
      {
        name: 'auction_op_prod_v1',
        script: ' node ./dist/auction/master/v1/op/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '216M',
        env: {
          NODE_ENV: 'production',
        }
      },
      {
        name: 'auction_arb_prod_v1',
        script: ' node ./dist/auction/master/v1/arb/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '216M',
        env: {
          NODE_ENV: 'production',
        }
      },
      {
        name: 'auction_polygon_prod_v1',
        script: ' node ./dist/auction/master/v1/polygon/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '216M',
        env: {
          NODE_ENV: 'production',
        }
      },
    ]
  };