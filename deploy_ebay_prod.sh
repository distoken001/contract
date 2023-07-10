#!/bin/bash

# 安装生产环境依赖
echo "Installing production dependencies..."
npm install --production

# 清理项目
echo "Cleaning the project..."
npm run clean

# 编译项目
#echo "Compiling the project..."
npx hardhat compile


# 使用 TypeScript 编译器编译项目
echo "Compiling TypeScript..."
tsc
  
# 使用 PM2 启动项目
echo "Starting the application with PM2..."
pm2 start pm2.ebay.prod.config.js
