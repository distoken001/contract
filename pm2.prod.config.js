module.exports = {
  apps: [
    {
      name: "monitor_op",
      script: " node ./dist/master/v1/op_chain/start.js",
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
      script: "node ./dist/master/v1/arb_chain/start.js",
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
      script: "node ./dist/master/v1/polygon_chain/start.js",
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
      script: "node ./dist/master/v1/avax_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "monitor_bsc",
      script: "node ./dist/master/v1/bsc_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "v2_monitor_conflux",
      script: "node ./dist/master/v2/conflux_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "v2_monitor_op",
      script: "node ./dist/master/v2/op_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "v2_monitor_arb",
      script: "node ./dist/master/v2/arb_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "v2_monitor_polygon",
      script: "node ./dist/master/v2/polygon_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "v2_monitor_avax",
      script: "node ./dist/master/v2/avax_chain/start.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "v2_monitor_bsc",
      script: "node ./dist/master/v2/bsc_chain/start.js",
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
