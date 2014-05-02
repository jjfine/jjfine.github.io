var http = require("http");
var path = require("path");
var fs = require("fs");
var url = require("url");

http.createServer(function(request, response) {
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(),uri);
  var contentByExtension = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.html': 'text/html' };

  path.exists(filename, function(exists) {
    if (!exists) filename = '404.html'
    if (fs.statSync(filename).isDirectory()) filename = '404.html';

    fs.readFile(filename,"binary", function(err, file) {
      response.writeHead(200, {'Content-Type': contentByExtension[path.extname(filename)]});
      response.write(file,"binary");
      response.end();
    });
  });

}).listen(8080);
