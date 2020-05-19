const {
  createProxyMiddleware
} = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(createProxyMiddleware('/api', {
    target: 'http://file.nobook.cc/',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/'
    }
  }))
}