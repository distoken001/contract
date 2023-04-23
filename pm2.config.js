module.exports = {
    apps: [
      {
        name: 'contract_monitor_op',
        script: ' node ./dist/op_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'dev',
        }
      },
      {
        name: 'contract_monitor_arb',
        script: 'node ./dist/arb_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'dev',
        }
      }
    ]
  };