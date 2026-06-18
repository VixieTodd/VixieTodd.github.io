'use strict';

const path = require('path');
const fs = require('fs');

/**
 * 本地开发服务器 404 处理：不存在的路径显示自定义 404.html
 * 部署到 GitHub Pages 后自动生效（无需此脚本）。
 */
hexo.extend.filter.register('server_middleware', function (app) {
  // 作为最后一个中间件，捕获所有未匹配的请求
  app.use((req, res, next) => {
    if (res.headersSent) return next();
    const filePath = path.join(hexo.public_dir, '404.html');
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) return next();
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.end(content);
    });
  });
});
