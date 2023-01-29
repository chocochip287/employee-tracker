/*
1/28/2023
To-do:
* Set up inquirer prompts and related queries

Future scoping:
* Enhance the validation of the newRole ID to ensure it can only be an ID value that exists in the departments table. Better yet, have the function query the departments table and make the results the only options rather than taking an input.

*/
// Connects to the connection.js file
const connection = require("./Develop/db/connection.js");
// Imports inquirer
const inquirer = require("inquirer");
// Imports table package
const { table } = require("table");

// Function to view all departments

const viewDepartments = () => {
    return connection.query(`SELECT * FROM departments`, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "name"]);
            console.log("\n" + table(prettyResult) + "\n");
            return homeMenu();
        }
    });
};

// Function to view all roles

const viewRoles = () => {
    return connection.query(`SELECT * FROM roles`, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "title", "salary", "department_id"]);
            console.log("\n" + table(prettyResult) + "\n");
            return homeMenu();
        }
    });
};

// Function to view all employees

const viewEmployees = () => {
    return connection.query(`SELECT * FROM employees`, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "first_name", "last_name", "role_id", "manager_id"]);
            console.log("\n" + table(prettyResult) + "\n");
            return homeMenu();
        }
    });
};

// Function to add a department

const addDepartment = () => {
    // need to use Inquirer to get the name of the department and insert it.

    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "deptName"
        },
    ])
    .then(({deptName}) => {
        connection.query(`INSERT INTO departments (name) VALUES ("${deptName}");`,

        function (err, result) {
            if (err) {
                console.error(err);
                return homeMenu();
            } else {
                console.log("\nYour department was added successfully.\n");
                viewDepartments();
                console.log("\n");
                return homeMenu();
            }
        });
    });
};

// Function to add a role (enter role name, salary, and department) - FINISH ME

const addRole = () => {
    // need to use Inquirer to get the name of the department and insert it.

    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new role?",
            name: "roleName"
        },
        {
            type: "input",
            message: "What is the new role's salary?",
            name: "roleSalary"
        },
        {
            type: "input",
            message: ""
        }
    ])
    .then(({deptName}) => {
        connection.query(`INSERT INTO departments (title, salary, department_id) VALUES ("${deptName}");`,

        function (err, result) {
            if (err) {
                console.error(err);
                return homeMenu();
            } else {
                console.log("\nYour department was added successfully.\n");
                viewDepartments();
                console.log("\n");
                return homeMenu();
            }
        });
    });
};

// Function to add an employee (enter first/last name, role, and manager)

// Function to update an employee role (select employee and role to update)

// Function to end the program and break the connection

function endProgram() {
    console.log("\nSee you next time!\n")
    connection.end();
}

// Initialization/main menu function

const homeMenu = () => {

    return inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
            name: "homeChoice"
        },
    ])
    .then(({homeChoice}) => {
        switch(homeChoice){
            case "Exit":
                endProgram();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                console.log("coming soon!");
                break;
            case "Add an employee":
                console.log("coming soon!");
                break;
            case "Update an employee role":
                console.log("coming soon!");
                break;
            default:
                return console.log("uuuhhh");
        }
    });
}

// App initialization function call

homeMenu();