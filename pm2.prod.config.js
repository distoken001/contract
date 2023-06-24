module.exports = {
  apps: [
    {
      name: "monitor_op",
      script: " node ./dist/master/op_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "monitor_arb",
      script: "node ./dist/master/arb_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "monitor_polygon",
      script: "node ./dist/master/polygon_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "monitor_avax",
      script: "node ./dist/master/avax_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    // {
    //   name: 'monitor_main',
    //   script: 'node ./dist/main_chain/start.js',
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   max_memory_restart: '512M',
    //   env: {
    //     NODE_ENV: 'production',
    //   }
    // },

    {
      name: "monitor_bsc",
      script: "node ./dist/master/bsc_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "monitor_conflux",
      script: "node ./dist/master/conflux_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
