const {
  createProxyMiddleware
} = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(createProxyMiddleware('/api', {
    target: 'http://pan.ciyun.vip/',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/'
    }
  }))
}