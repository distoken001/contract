const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
}
// 将 JSON 字符串解析为对象
const dbConfig = JSON.parse(process.env.DB_CONFIG!);
export {
  dbConfig
};
