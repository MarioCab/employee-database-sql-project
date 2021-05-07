const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "blank",
  database: "employeeTracker_DB",
  insecureAuth: true,
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
        "INSERT INTO department SET ?",
        {
          id: answer.deptID,
          dept_name: answer.deptName,
        },
        (err) => {
          if (err) throw err;
          console.log("Department Created!");
          startQuestions();
        }
      );
    });
};

connection.connect((err) => {
  if (err) throw err;
  startQuestions();
});
