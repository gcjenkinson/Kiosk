var fs = require('fs');
var http = require('http');
var url = require('url') ;
var time = new Date();
var myfile = './data/' + Date.now() + '.xls';
var clickDataStr = "";

//Create header ...
var head = "Click" + "\t" + "Time" + "\n";
fs.appendFile(myfile, head, function (err) {
                               if (err) return console.log(err);
                               console.log('ADD LOG > ' + myfile);
                               });

http.createServer(function (req, res) {
                  var queryObject = url.parse(req.url,true).query;
                  console.log(queryObject);
                  if(queryObject!={}){
                        clickDataStr = getData(queryObject);
                        fs.appendFile(myfile, clickDataStr, function (err) {
                               if (err) return console.log(err);
                               console.log('ADD LOG > ' + myfile);
                               });
                  }                  
                  res.writeHead(200);
                  res.end('Feel free to add query parameters to the end of the url');
                  }).listen(8090);

function getData(rawData){
      var dataStr = "";
      var strData = JSON.stringify(rawData);
      strData = strData.slice(1, strData.length - 1);
      var data = strData.split(",");
      var order = data[0].split(":");
      var orderData = order[1].slice(1, order[1].length - 1);
      var time = data[1].split(":");
      var timeData = time[1].slice(1, time[1].length - 1);
      dataStr = dataStr + orderData + "\t";
      dataStr = dataStr + timeData + "\n";
      return dataStr;
}

