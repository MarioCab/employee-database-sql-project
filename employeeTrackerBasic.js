const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3000,
  user: "root",
  password: "Icancode123!",
  database: "employeeTracker_DB",
});

const startQuestions = () => {
  inquirer
    .prompt({
      name: `introQuestion`,
      type: `list`,
      message: `What would you like to add to the database?`,
      choices: [`Department`, `Role`, `Employee`, `Nothing`],
    })
    .then((answer) => {
      if (answer.introQuestion === "Department") {
        addDept();
      } else if (answer.introQuestion === "Role") {
        addRole();
      } else if (answer.introQuestion === "Employee") {
        addEmployee();
      } else {
        connection.end;
      }
    });
};
