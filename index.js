/*
1/28/2023
To-do:
* Finish inquirer prompts and related queries.
* update viewEmployees with the finalized query from workbench to get the info shown in the video.

Future scoping:

*/

// Connects to the connection.js file
const connection = require("./Develop/db/connection.js");
// Imports inquirer
const inquirer = require("inquirer");
// Imports table package
const { table } = require("table");
// Imports queries file
const queries = require("./Develop/lib/queries.js")

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
    return connection.query(queries.employeeQuery, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "first_name", "last_name", "title", "department", "salary", "manager"]);
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
            name: "deptName",
            validate: nameGiven => {
                if (nameGiven) {
                    return true;
                } else {
                    console.log("\nPlease provide a name for the new department.")
                }
            }
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

// Function to add a role (enter role name, salary, and department)

const addRole = () => {
    // Variable to hold the array of current departments and their IDs
    let deptArray = [];
    // Variable to hold an array of the current departments formatted for inquirer choices
    let formattedDepts = [];
    // Queries the list of current departments to fill the above arrays
    connection.query(`SELECT * FROM departments`, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        // 
        else {
            // Plugs the current departments table into an array
            deptArray = result.map( obj => Object.values(obj) );
            // Formats the query results for use as inquirer choices 
            for(let i = 0; i < deptArray.length; i++) {
                const department = deptArray[i][0] + ": " + deptArray[i][1];
                formattedDepts.push(department);
            }            
            return
        }
    });
    // Questions to get inputs for the new role
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new role?",
            name: "roleName",
            validate: nameGiven => {
                if (nameGiven) {
                    return true;
                } else {
                    console.log("\nPlease provide a name for the new role.")
                }
            }
        },
        {
            type: "input",
            message: "What is the new role's salary?",
            name: "roleSalary",
            validate: salaryGiven => {
                if (salaryGiven && !isNaN(salaryGiven)) {
                    return true;
                } else {
                    console.log("\nPlease provide a numeric value for the new role's salary.")
                }
            }
        },
        {
            type: "list",
            message: "Select the department that this role belongs to.",
            choices: formattedDepts,
            name: "roleDeptID"
        }
    ])
    .then((responses) => {
        let chosenDept = responses.roleDeptID.charAt(0);

        connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${responses.roleName}", "${responses.roleSalary}", "${chosenDept}");`,

        function (err, result) {
            if (err) {
                console.error(err);
                return homeMenu();
            } else {
                console.log("\nYour new role was added successfully.\n");
                viewRoles();
                console.log("\n");
                return homeMenu();
            }
        });
    });
};

// Function to add an employee (enter first/last name, role, and manager)

const addEmployee = () => {
    // Variable to hold the array of current roles and their IDs
    let rolesArray = [];
    // Variable to hold an array of the current roles formatted for inquirer choices
    let formattedRoles = [];
    // Variable to hold the array of current managers and their IDs
    let managerArray = [];
    // Variable to hold an array of the current managers formatted for inquirer choices
    let formattedManagers = [];
    // Queries the id and titles of current roles to fill the above arrays
    connection.query(`SELECT id, title FROM roles`, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        // 
        else {
            // Plugs the current departments table into an array
            rolesArray = result.map( obj => Object.values(obj) );
            // Formats the query results for use as inquirer choices 
            for(let i = 0; i < rolesArray.length; i++) {
                const role = rolesArray[i][0] + ": " + rolesArray[i][1];
                formattedRoles.push(role);
            }            
            return
        }
    });
    // Queries the id and names of current managers to fill the related arrays
    connection.query(`SELECT id, first_name, last_name FROM employees WHERE role_id = 1 OR role_id = 2`, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        // 
        else {
            // Plugs the current managers into an array
            managerArray = result.map( obj => Object.values(obj) );
            // Formats the query results for use as inquirer choices 
            for(let i = 0; i < managerArray.length; i++) {
                const manager = managerArray[i][0] + ": " + managerArray[i][1] + " " + managerArray[i][2];
                formattedManagers.push(manager);
            }            
            return
        }
    });
    // Questions to get inputs for the new employee
    inquirer.prompt([
        {
            type: "input",
            message: "What is the new employee's first name?",
            name: "employeeFirstName",
            validate: nameGiven => {
                if (nameGiven) {
                    return true;
                } else {
                    console.log("\nPlease provide a first name for the new employee.")
                }
            }
        },
        {
            type: "input",
            message: "What is the new employee's last name?",
            name: "employeeLastName",
            validate: nameGiven => {
                if (nameGiven) {
                    return true;
                } else {
                    console.log("\nPlease provide a last name for the new employee.")
                }
            }
        },
        {
            type: "list",
            message: "What is the new employee's role?",
            choices: formattedRoles,
            name: "employeeRole"
        },
        {
            type: "list",
            message: "Who will the new employee report to?",
            choices: formattedManagers,
            name: "employeeManager"
        }
    ])
    .then((responses) => {
        let employeeManager = responses.employeeManager.charAt(0);
        let employeeRole = responses.employeeRole.charAt(0);

        connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${responses.employeeFirstName}", "${responses.employeeLastName}", ${employeeRole}, ${employeeManager});`,

        function (err, result) {
            if (err) {
                console.error(err);
                return homeMenu();
            } else {
                console.log("\nYour new employee was added successfully.\n");
                viewEmployees();
                console.log("\n");
                return homeMenu();
            }
        });
    });
};

// Function to update an employee role (select employee and role to update)

const updateEmployeeRole = () => {
    // Array to hold employee names
    let employeesArray = [];
    // Array to hold formatted employee names for inquirer
    let formattedEmployees = [];
    // Array to hold roles
    let rolesArray = [];
    // Array to hold formatted roles for inquirer
    let formattedRoles = [];
    // Query to grab employees and their current roles
    connection.query(queries.getEmployeesForUpdate, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        else {
            // Plugs employees into an array
            employeesArray = result.map( obj => Object.values(obj) );
            // Formats employees for use as inquirer choices 
            for(let i = 0; i < employeesArray.length; i++) {
                const employee = employeesArray[i][0] + ": " + employeesArray[i][1];
                formattedEmployees.push(employee);
            }
            // console.log(`\nemployeesArray is ${employeesArray}.\n`);
            // console.log(`formattedEmployees is ${formattedEmployees}.\n`);
            return
        }
    });
    // Query to grab the list of current roles
    connection.query(queries.getRolesForUpdate, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            return homeMenu();
        } 
        else {
            // Plugs roles query results into an array
            rolesArray = result.map( obj => Object.values(obj) );
            // Formats employees for use as inquirer choices 
            for(let i = 0; i < rolesArray.length; i++) {
                const role = rolesArray[i][0] + ": " + rolesArray[i][1];
                formattedRoles.push(role);
            }
            // console.log(`\nrolesArray is ${rolesArray}.\n`);
            // console.log(`formattedRoles is ${formattedRoles}.\n`);
            return
        }
    });
    // Employee and updated role selection prompt
    inquirer.prompt ([
        {
            type: "list",
            message: "Which employee would you like to update?",
            choices: formattedEmployees,
            name: "selectedEmployee"
        },
        {
            type: "list",
            message: "What role should this employee be assigned to?",
            choices: formattedRoles,
            name: "selectedRole"
        }
    ])
    .then((responses) =>{
        // isolates employee ID
        //let employeeID = responses.employeeManager.charAt(0);
        //let RoleID = responses.employeeRole.charAt(0);
        console.log(`\nThe selected employee is ${responses.selectedEmployee}.\n`);
        console.log(`The updated role will be ${responses.selectedRole}.\n`);
        homeMenu();
    }
)};

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
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            default:
                return console.log("uuuhhh");
        }
    });
}

// App initialization function call

homeMenu();