const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3006,
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

startQuestions();

const addDept = () => {
  inquirer
    .prompt([
      {
        name: "deptID",
        type: "input",
        message: "What is the ID number of the department?",
      },
      {
        name: "deptName",
        type: "input",
        message: "What is the department called?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department",
        {
          id: answer.deptID,
          name: answer.deptName,
        },
        (err) => {
          if (err) throw err;
          console.log("Department Created!");
          startQuestions();
        }
      );
    });
};

// connection.connect((err) => {
//   if (err) throw err;
//   startQuestions();
// });
