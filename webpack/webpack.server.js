var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./dev.config.js');
var config = require('../src/config');
var host = config.host || 'localhost';
var port = (config.port + 1) || 3001;

new WebpackDevServer(webpack(webpackConfig), {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'http://' + host + ':' + port,
  hot: true,
  historyApiFallback: true,
  quiet: true,
  stats: {
    colors: true
  }
}).listen(port, 'localhost', function (err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:' + port);
});
