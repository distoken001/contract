module.exports = {
    apps: [
      {
        name: 'monitor_op',
        script: ' node ./dist/op_goerli_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'development',
        }
      },
    ]
  };