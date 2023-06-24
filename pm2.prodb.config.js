module.exports = {
  apps: [
    {
      name: "monitor_op_prodb",
      script: " node ./dist/master/op_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_arb_prodb",
      script: "node ./dist/master/arb_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_polygon_prodb",
      script: "node ./dist/master/polygon_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_avax_prodb",
      script: "node ./dist/master/avax_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_bsc_prodb",
      script: "node ./dist/master/bsc_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_conflux_prodb",
      script: "node ./dist/master/conflux_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
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
    //     NODE_ENV: 'productionb',
    //   }
    // },
  ],
};
