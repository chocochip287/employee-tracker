/*
1/30/2023
To-do:
* Complete the functionality to update roles. Struggled here with building the needed promise based/asynchronous querying to achieve the desired output.

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
            homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "name"]);
            console.log("\n" + table(prettyResult) + "\n");
            homeMenu();
        }
    });
};

// Function to view all roles

const viewRoles = () => {
    return connection.query(`SELECT * FROM roles`, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "title", "salary", "department_id"]);
            console.log("\n" + table(prettyResult) + "\n");
            homeMenu();
        }
    });
};

// Function to view all employees

const viewEmployees = () => {
    return connection.query(queries.employeeQuery, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "first_name", "last_name", "title", "department", "salary", "manager"]);
            console.log("\n" + table(prettyResult) + "\n");
            homeMenu();
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
                homeMenu();
            } else {
                console.log("\nYour department was added successfully.\n");
                viewDepartments();
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
            homeMenu();
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
                homeMenu();
            } else {
                console.log("\nYour new role was added successfully.\n");
                viewRoles();
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
        let employeeRoleArray = responses.employeeRole.split(":");
        let employeeRole = employeeRoleArray[0];

        connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${responses.employeeFirstName}", "${responses.employeeLastName}", ${employeeRole}, ${employeeManager});`,

        function (err, result) {
            if (err) {
                console.error(err);
                homeMenu();
            } else {
                console.log("\nYour new employee was added successfully.\n");
                viewEmployees();
            }
        });
    });
};

// Function to get employee data for update process

const employeeQuery = (query) => {

    return new Promise( (resolve, reject) => {
        connection.query(query, function (err, results) {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

// Function to get roles data for update process

const rolesQuery = (query) => {

    return new Promise( (resolve, reject) => {
        connection.query(query, function (err, results) {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
};

// Function to update an employee role (select employee and role to update)

const updateEmployeeRole = () => {
    console.log("This is a work in progress. I'm having some struggles with writing up this function in a promise based/asynchronous way so that the expected arrays are getting built out. I will revisit this as soon as I'm able but I want to ensure other camp responsibilities are being addressed.\n");
    homeMenu();
}

// Function to end the program and break the connection

function endProgram() {
    console.log("\nSee you next time!\n")
    connection.end();
}

// Initialization/main menu function

const homeMenu = () => {

    inquirer.prompt([
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
                // the below is outputting the results of the query then getting back to the menu! I only half get it but this is a start!
                //employeeQuery(queries.getEmployeesForUpdate)
                //.then(results => console.log(results))
                //.then(homeMenu());
                break;
            default:
                return console.log("Something went really wrong.");
        }
    });
}

// App initialization function call

homeMenu();