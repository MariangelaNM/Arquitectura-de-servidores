//REST API demo in Node.js
var express = require("express"); // requre the express framework
var app = express();
var fs = require("fs"); //require file system object
var employeesData = require('./employees.json');;

// Endpoint to Get a list of users
app.get("/api/employees", function (req, res) {
  if(parseInt(req.query.page)==1){
    res.end(JSON.stringify(employeesData.slice(0,2))); // you can also use res.send()
  }
  else if(parseInt(req.query.page)==2){
    res.end(JSON.stringify(employeesData.slice(2,4))); // you can also use res.send()
  }
  else{
    res.end(JSON.stringify(employeesData)); // you can also use res.send()
  }

});
// Endpoint to Get a list of users
app.get("/api/employees?page=1", function (req, res) {
  console.log(employeesData.slice(1,2))
  res.end(JSON.stringify(employeesData.slice(0,2))); // you can also use res.send()
});

// Create a server to listen at port 8080
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("REST API demo app listening at http://%s:%s", host, port);
});


