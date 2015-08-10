var fs = require('fs');
var http = require('http');
var url = require('url') ;
var time = new Date();
var myfile = Date.now() + '.xls';
var orderDataStr = "";

//Create header ...
var head = "";
for( var i=1; i<= 11; i++){
	head = head + "Order " + i + "\t";
}
head = head + "Time" + "\n";
fs.appendFile(myfile, head, function (err) {
                               if (err) return console.log(err);
                               console.log('ADD LOG > ' + myfile);
                               });

http.createServer(function (req, res) {
                  var queryObject = url.parse(req.url,true).query;
                  console.log(queryObject);
                  if(queryObject!={}){
					  orderDataStr = getData(queryObject);
					  fs.appendFile(myfile, orderDataStr, function (err) {
								   if (err) return console.log(err);
								   console.log('ADD LOG > ' + myfile);
								   });
				  }
                  console.log(orderDataStr);
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
	var orderArray = orderData.split(">");
	var time = data[1].split(":");
	var timeData = time[1].slice(1, time[1].length - 1);
	for (var i = 0; i < orderArray.length; i++){
		dataStr = dataStr + orderArray[i] + "\t";
	}
	dataStr = dataStr + timeData + "\n";
	return dataStr;
}

