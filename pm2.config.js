module.exports = {
    apps: [
      {
        name: 'contract_monitor',
        script: ' node ./dist/op_chain/start.js&&node ./dist/arb_chain/start.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'dev',
        },
        env_production: {
          NODE_ENV: 'prod',
        },
      },
    ],
  };