module.exports = {
    apps: [
      {
        name: 'monitor_op_goerli',
        script: ' node ./dist/ebay/dev/v1/op_goerli_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'development',
        }
      },
      {
        name: 'monitor_arb_goerli',
        script: ' node ./dist/ebay/dev/v1/arb_goerli_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'development',
        }
      },
      {
        name: 'v2_monitor_op_goerli',
        script: ' node ./dist/ebay/dev/v2/op_goerli_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'development',
        }
      },
      
    ]
  };