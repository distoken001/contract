#!/bin/bash

# 清理项目
echo "Cleaning the project..."
npm run clean

# 编译项目
echo "Compiling the project..."
npx hardhat compile

# 安装生产环境依赖
echo "Installing production dependencies..."
npm install --production

# 使用 TypeScript 编译器编译项目
echo "Compiling TypeScript..."
tsc

# 使用 PM2 启动项目
echo "Starting the application with PM2 in production environment..."
pm2 start pm2.config.js --env production