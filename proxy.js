/*global module:false*/
var run = function() {
  var express   = require('express'),
      httpProxy = require('http-proxy');

  var apiPort = 3000,
      webPort = 8000,
      app = express();

  app.configure(function() {
    app.use(express.bodyParser());
    app.use(apiProxy('localhost', apiPort, new httpProxy.RoutingProxy()));
    app.use(express.errorHandler());
  });

  console.log('Starting express web server on port '+webPort);
  console.log('Proxying API requests to localhost:'+apiPort);
  app.listen(webPort);
};

var apiProxy = function(host, port, proxy) {
  proxy.on('proxyError', function(err, req, res){
    res.statusCode = 500;
    res.write("API Proxying to `"+req.url+"` failed with: `"+err.toString()+"`");
    res.end();
  });

  return function(req, res, next) {
     if(req.url.match(/^\/api\//)) {
      console.log("proxying a request!");
      proxy.proxyRequest(req, res, {host: host, port: port});
    }
  }
}

var wait = function() {};

run();
setTimeout(0, wait());
