module.exports = {
    apps: [
      {
        name: 'monitor_op_goerli',
        script: ' node ./dist/dev/v1/op_goerli_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'development',
        }
      },
      {
        name: 'monitor_arb_goerli',
        script: ' node ./dist/dev/v1/arb_goerli_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '512M',
        env: {
          NODE_ENV: 'development',
        }
      },
      {
        name: 'v2_monitor_op_goerli',
        script: ' node ./dist/dev/v2/op_goerli_chain/start.js',
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