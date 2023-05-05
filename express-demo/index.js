//REST API demo in Node.js
var express = require("express"); // requre the express framework
var app = express();
var employeesData = require("./employees.json");

// Endpoint to Get a list of users
app.get("/api/employees", function (req, res) {
  if (parseInt(req.query.page) == 1) {
    res.end(JSON.stringify(employeesData.slice(0, 2)));
  } else if (parseInt(req.query.page) == 2) {
    res.end(JSON.stringify(employeesData.slice(2, 4)));
  } else if (req.query.page === "N") {
    var initial = 2 * (Object.keys(employeesData).length - 1);
    var final = 2 * (Object.keys(employeesData).length - 1) + 1;
    res.end(JSON.stringify(employeesData.slice(initial, final)));
  } else if (req.query.user === "true") {
    res.end(JSON.stringify(activePeople));
  } else if (req.query.badges === "black") {
    res.end(JSON.stringify(containsBlack()));
  } else {
    res.end(JSON.stringify(employeesData));
  }
});

app.get("/api/employees/oldest", function (req, res) {
  res.end(JSON.stringify(oldestEmploye));
});

// Create a server to listen at port 8000
var server = app.listen(8000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("REST API demo app listening at http://%s:%s", host, port);
});

const oldestEmploye = employeesData.reduce((oldest, current) => {
  // Compare the age of the current person with the age of the oldest person
  if (current.age > oldest.age) {
    return current; // if the current person is older, set them as the new oldest person
  } else {
    return oldest; // otherwise, keep the current oldest person
  }
});

const activePeople = employeesData.filter((person) => {
  // Check if the person is user
  if (person.privileges == "user") {
    return person;
  }
});

function containsBlack() {
  var result = [];
  employeesData.forEach((person) => {
    for (let i = 0; i < person.badges.length; i++) {
      if (person.badges[i] === "black") {
        result.push(person);
        break;
      }
    }
  });
  return result;
}
