// Requirements

const mysql = require("mysql2");
const inquirer = require("inquirer");
const RawListPrompt = require("inquirer/lib/prompts/rawlist");
const { printTable } = require("console-table-printer");
const util = require("util");
const { type } = require("os");
const { title } = require("process");
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
        `Add to Database`,
        `Remove from Database`,
        `Update Database`,
        `View Database`,
        `Nothing`,
      ],
    })
    .then((answer) => {
      if (answer.introQuestion === "Add to Database") {
        addToDb();
      } else if (answer.introQuestion === "Remove from Database") {
        rmFromDb();
      } else if (answer.introQuestion === "Update Database") {
        updateDb();
      } else if (answer.introQuestion === "View Database") {
        viewDb();
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

const addRole = async () => {
  connection.query = util.promisify(connection.query);
  const dept = await connection.query(
    "SELECT dept_name, dept_id FROM department"
  );
  console.log(dept);
  const deptArray = dept.map(({ dept_name, dept_id }) => ({
    name: dept_name,
    value: dept_id,
  }));
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
      {
        name: "whatDept",
        tpye: "list",
        message: "What department does this role belong to?",
        choices: deptArray,
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

const addEmployee = async () => {
  connection.query = util.promisify(connection.query);
  const roles = await connection.query("SELECT title, role_id FROM role");
  console.log(roles);
  const roleArray = roles.map(({ title, role_id }) => ({
    name: title,
    value: role_id,
  }));
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
      {
        name: "whatRole",
        type: "list",
        message: "What is their role?",
        choices: roleArray,
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.whatRole,
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

const rmFromDb = () => {
  inquirer
    .prompt({
      name: "whatToRemove",
      type: "list",
      message: "What would you like to remove?",
      choices: [`Department`, `Role`, `Employee`, `Nothing`],
    })
    .then((answer) => {
      if (answer.whatToRemove === "Department") {
        rmDept();
      } else if (answer.whatToRemove === "Role") {
        rmRole();
      } else if (answer.whatToRemove === "Employee") {
        rmEmployee();
      } else {
        console.log("Have a good day!");
        connection.end;
      }
    });
};

// Remove a department

const rmDept = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "selectDept",
          type: "rawlist",
          choices() {
            choiceList = [];
            results.forEach(({ dept_name }) => {
              choiceList.push(dept_name);
            });
            choiceList.push("Go Back");
            return choiceList;
          },
          message: "What department would you like to remove?",
        },
      ])
      .then((answer) => {
        if (answer.selectDept === "Go Back") {
          startQuestions();
        } else {
          connection.query("DELETE FROM department WHERE ?", {
            dept_name: answer.selectDept,
          });
          console.log("Department removed");
          startQuestions();
        }
      });
  });
};

// Remove a role

const rmRole = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "selectRole",
          type: "rawlist",
          choices() {
            choiceList = [];
            results.forEach(({ title }) => {
              choiceList.push(title);
            });
            choiceList.push("Go Back");
            return choiceList;
          },
          message: "What role would you like to remove?",
        },
      ])
      .then((answer) => {
        if (answer.selectRole === "Go Back") {
          startQuestions();
        } else {
          connection.query("DELETE FROM role WHERE ?", {
            title: answer.selectRole,
          });
          console.log("Role removed");
          startQuestions();
        }
      });
  });
};

// Remove an Employee

const rmEmployee = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "selectEmployee",
          type: "rawlist",
          choices() {
            choiceList = [];
            results.forEach(({ first_name }) => {
              choiceList.push(first_name);
            });
            choiceList.push("Go Back");
            return choiceList;
          },
          message: "Which employee would you like to remove?",
        },
      ])
      .then((answer) => {
        if (answer.selectEmployee === "Go Back") {
          startQuestions();
        } else {
          connection.query("DELETE FROM employee WHERE ?", {
            first_name: answer.selectEmployee,
          });
          console.log("Employee removed");
          startQuestions();
        }
      });
  });
};

// Viewing Database

const viewDb = () => {
  connection.query = util.promisify(connection.query);
  inquirer
    .prompt({
      name: "viewWhat",
      type: "list",
      message: "What table do you want to view?",
      choices: ["Department", "Role", "Employee", "View Company", "Nevermind"],
    })
    .then((answer) => {
      switch (answer.viewWhat) {
        case "Department":
          viewDept();
          break;
        case "Role":
          viewRole();
          break;
        case "Employee":
          viewEmployee();
          break;
        case "View Company":
          // call view company
          break;
        default:
          startQuestions();
          break;
      }
    });
};
const viewDept = () => {
  connection.query = util.promisify(connection.query);
  connection
    .query("SELECT dept_name AS Department FROM department")
    .then((res) => printTable(res))
    .catch((err) => console.log(err));
};
const viewRole = () => {
  connection.query = util.promisify(connection.query);
  connection
    .query("SELECT title AS Title FROM role")
    .then((res) => printTable(res))
    .catch((err) => console.log(err));
};
const viewEmployee = () => {
  connection.query = util.promisify(connection.query);
  connection
    .query("SELECT CONCAT(first_name, ' ', last_name) AS Name FROM employee")
    .then((res) => printTable(res))
    .catch((err) => console.log(err));
};
// const viewCompany = () => {
//   connection.query = util.promisify(connection.query);
//   connection
//     .query("SELECT dept_name AS Department FROM department")
//     .then((res) => printTable(res))
//     .catch((err) => console.log(err));
// };
//start server

connection.connect((err) => {
  if (err) throw err;
  startQuestions();
});
