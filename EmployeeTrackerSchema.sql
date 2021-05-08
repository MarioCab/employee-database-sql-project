DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department(
    dept_id INT NOT NULL PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);


CREATE TABLE role(
    role_id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(5,2),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(dept_id)
);


CREATE TABLE employee(
    employee_id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
    -- REFERENCE MANAGER ID HERE IN FUTURE
);
