/*global module:false*/
module.exports = function(grunt) {
  grunt.initConfig({
    server: {
      apiProxy: {
        enabled: true,
        host: 'localhost',
        port: 3000
      }
    },
    watch: {
      files : ['empty/**/*'],
      tasks : []
    }
  });

  grunt.registerTask('default', '', function() {
    var _ = grunt.utils._,
        express   = require('express'),
        httpProxy = require('http-proxy');

    var apiPort = 3000,
        webPort = 8000,
        app = express();

    app.configure(function() {
      app.use(express.bodyParser());
      app.use(apiProxy('localhost', apiPort, new httpProxy.RoutingProxy()));
      app.use(express.errorHandler());
    });

    grunt.log.writeln('Starting express web server in "./generated" on port '+webPort);
    grunt.log.writeln('Proxying API requests to localhost:'+apiPort);
    app.listen(webPort);
  });

  var apiProxy = function(host, port, proxy) {
    proxy.on('proxyError', function(err, req, res){
      res.statusCode = 500;
      res.write("API Proxying to `"+req.url+"` failed with: `"+err.toString()+"`");
      res.end();
    });

    return function(req, res, next) {
      proxy.proxyRequest(req, res, {host: host, port: port});
    }
  }
};
