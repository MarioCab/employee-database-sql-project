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
      message: `What would you like to do?`,
      choices: [
        `Add to database`,
        `Remove from database`,
        `Update database`,
        `Nothing`,
      ],
    })
    .then((answer) => {
      if (answer.introQuestion === "Add to database") {
        addToDb();
      } else if (answer.introQuestion === "Remove from database") {
        rmFromDb();
      } else if (answer.introQuestion === "Update database") {
        updateDb();
      } else {
        console.log("Have a good day!");
        connection.end;
      }
    });
};

// Questions to add to database

const addToDb = () => {
  inquirer
    .prompt({
      name: `addQuestion`,
      type: `list`,
      message: `What would you like to add to the database?`,
      choices: [`Department`, `Role`, `Employee`, `Nothing`],
    })
    .then((answer) => {
      if (answer.addQuestion === "Department") {
        addDept();
      } else if (answer.addQuestion === "Role") {
        addRole();
      } else if (answer.addQuestion === "Employee") {
        addEmployee();
      } else {
        console.log("Have a good day!");
        connection.end;
      }
    });
};

// add a department

const addDept = () => {
  inquirer
    .prompt([
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

// add a role

const addRole = () => {
  inquirer
    .prompt([
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

// add an employee

const addEmployee = () => {
  inquirer
    .prompt([
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

// questions for removing from database

const rmFromDb () => {
  inquirer
  .prompt({

  })
};

//start server

connection.connect((err) => {
  if (err) throw err;
  startQuestions();
});
