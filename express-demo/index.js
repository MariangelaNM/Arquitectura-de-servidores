//REST API demo in Node.js
var express = require("express"); // requre the express framework
var app = express();
var employeesData = require("./employees.json");
app.use(express.json());
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

app.get('/api/employees/:name', (req, res) => {
  const name = req.params.name;
  const employee = employeesData.find(emp => emp.name === name);

  if (!employee) {
    return res.status(404).send('Employee not found');
  }

  res.send(employee);
});

app.post('/api/employees', (req, res) => {
  const employee = req.body;

  // Check that the employee object has the same keys as the other employees
  const keys = Object.keys(employeesData[0]);
  if (!keys.every(key => Object.keys(employee).includes(key))) {
    return res.status(400).send('Invalid employee format');
  }

  // Check that the values of the employee object are of the same type as the other employees
  const validTypes = employeesData.every(emp => {
    return Object.keys(emp).every(key => typeof employee[key] === typeof emp[key]);
  });
  if (!validTypes) {
    return res.status(400).send('Invalid employee format');
  }

  employeesData.push(employee);

  res.send(employee);
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
