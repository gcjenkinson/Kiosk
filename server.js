var fs = require('fs');
var http = require('http');
var url = require('url') ;
var time = new Date();
var myfile = Date.now() + '.txt';

http.createServer(function (req, res) {
                  var queryObject = url.parse(req.url,true).query;
                  console.log(queryObject);
                  if(queryObject!={})
                  fs.appendFile(myfile, JSON.stringify(queryObject), function (err) {
                               if (err) return console.log(err);
                               console.log('ADD LOG > ' + myfile);
                               });
                  
                  res.writeHead(200);
                  res.end('Feel free to add query parameters to the end of the url');
                  }).listen(8090);


