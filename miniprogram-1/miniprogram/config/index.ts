// 环境配置
const ENV = 'development'; // 'development' | 'production'

const CONFIG = {
  development: {
    baseUrl: 'http://172.20.10.2:8000'
  },
  production: {
    baseUrl: 'https://api.your-domain.com'  // 替换为实际生产域名
  }
};

export const BASE_URL = CONFIG[ENV].baseUrl;
