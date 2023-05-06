module.exports = {
  containsBlack: function (employeesData) {
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
  },
  activePeople: function (employeesData) {
    var result = [];
    employeesData.filter((person) => {
      // Check if the person is user
      if (person.privileges == "user") {
        result.push(person);
      }
    });
    return result;
  },
  oldestEmploye: function (employeesData) {
    var result = [];
    employeesData.reduce((oldest, current) => {
      // Compare the age of the current person with the age of the oldest person
      if (current.age > oldest.age) {
        return current; // if the current person is older, set them as the new oldest person
      } else {
        result.pop();
        result.push(oldest);
        return oldest; // otherwise, keep the current oldest person
      }
    });
    return result;
  },
};
