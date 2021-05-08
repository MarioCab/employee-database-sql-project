// Requirements

const mysql = require("mysql2");
const inquirer = require("inquirer");

// conections

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "blank",
  database: "employeeTracker_DB",
  insecureAuth: true,
});

// Starting questions

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

// Questions to fill DB

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
          dept_id: answer.deptID,
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
const addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleID",
        type: "input",
        message: "What is the ID number of the role?",
      },
      {
        name: "roleTitle",
        type: "input",
        message: "What is the role called?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the salary of the job?",
        default: "EX: 50.000",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          role_id: answer.roleID,
          title: answer.roleTitle,
          salary: answer.roleSalary,
        },
        (err) => {
          if (err) throw err;
          console.log("Role Created!");
          startQuestions();
        }
      );
    });
};
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "employeeID",
        type: "input",
        message: "What is the ID number of the employee?",
      },
      {
        name: "firstName",
        type: "input",
        message: "What is their first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is their last name?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          employee_id: answer.employeeID,
          first_name: answer.firstName,
          last_name: answer.lastName,
        },
        (err) => {
          if (err) throw err;
          console.log("Employee Created!");
          startQuestions();
        }
      );
    });
};

//start server

connection.connect((err) => {
  if (err) throw err;
  startQuestions();
});
