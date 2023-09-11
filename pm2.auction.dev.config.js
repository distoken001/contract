module.exports = {
    apps: [
      {
        name: 'auction_op_goerli',
        script: ' node ./dist/auction/dev/v1/op_goerli_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        cron_restart: '0 0 * * *', // 每天午夜重启一次
        max_memory_restart: '216M',
        env: {
          NODE_ENV: 'development',
        }
      },
    ]
  };