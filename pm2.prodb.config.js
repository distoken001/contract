module.exports = {
  apps: [
    {
      name: "monitor_op",
      script: " node ./dist/op_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_arb",
      script: "node ./dist/arb_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_polygon",
      script: "node ./dist/polygon_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    {
      name: "monitor_avax",
      script: "node ./dist/avax_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "productionb",
      },
    },
    // {
    //   name: 'monitor_bsc',
    //   script: 'node ./dist/bsc_chain/start.js',
    //   instances: 1,
    //   autorestart: true,
    //   watch: false,
    //   max_memory_restart: '512M',
    //   env: {
    //     NODE_ENV: 'productionb',
    //   }
    // },
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
