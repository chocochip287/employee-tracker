/*
3/10/2023
To-do:
* Tinker with the asynchronous functionality in the update code. The update query runs as expected but the flow of the function seems off since the success messge doesn't show within the try segment.

Future scoping:
* Expand the update employee function to prompt the user to select what they're looking to update for a given employee rather than having the default and sole function be to update their role. The current functionality is set up as a minimum viable product sort of thing - to demonstrate that it's possible to update the DB via back end, SQL free commands.

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
    return connection.query(queries.rolesQuery, (err, result) => {
        // Error statement and a return home in the event of an issue
        if (err) {
            console.error(err);
            homeMenu();
        } 
        // If all's well, formats the returned objects into an array and uses the table package to format them before returning home
        else {
            let prettyResult = result.map( obj => Object.values(obj) );
            // Inserts the table's column headers as the first row in the formatted return
            prettyResult.unshift(["id", "title", "salary", "department"]);
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
            // returns an array of objects, e.g. { id: 1, name: 'Marketing' }
            deptArray = result.map( obj => Object.values(obj) );
            // Formats the query results into strings for use as inquirer choices
            for(let i = 0; i < deptArray.length; i++) {
                const department = deptArray[i][0] + ": " + deptArray[i][1];
                formattedDepts.push(department);
            }
            // console.log(formattedDepts);
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
        // Takes the value from the left of the colon from the formatted departments list. Written this way to allow for double digit department values to be chosen
        let thisDept = responses.roleDeptID.split(":")
        let chosenDept = thisDept[0];

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
        let employeeManagerArray = responses.employeeManager.split(":")
        let employeeManager = employeeManagerArray[0];
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
        connection.query(query, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

// Function to get roles data for update process

const rolesQuery = (query) => {

    return new Promise( (resolve, reject) => {
        connection.query(query, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
};

// Function to update an employee role (select employee and role to update)

const updateEmployeeRole = async () => {
    // Unformatted employee array
    let employeeArray = [];
    // Formatted employee array
    let formattedEmployees = [];
    // Unformatted roles array
    let rolesArray = [];
    // Formatted roles array
    let formattedRoles = [];
    // Async query to get employee info
    try {
        const results = await employeeQuery(queries.getEmployeesForUpdate);
        // Sets the unformatted query results into an array
        employeeArray = results.map( obj => Object.values(obj) );
        // Formats the query results for Inquirer
        for(let i = 0; i < employeeArray.length; i++){
            const employee = employeeArray[i][0] + ": " + employeeArray[i][1] + ", whose current role is " + employeeArray[i][2];
            formattedEmployees.push(employee);
        };
    }
    catch(err) {
        console.log("Something went wrong");
    };
    // Async query to get current roles
    try {
        const results = await rolesQuery(queries.getRolesForUpdate);
        // Sets the unformatted query results into an array
        rolesArray = results.map( obj => Object.values(obj) );
        // Formats the query results for Inquirer
        for(let i = 0; i < rolesArray.length; i++){
            const role = rolesArray[i][0] + ": " + rolesArray[i][1];
            formattedRoles.push(role);
        };
    }
    catch(err) {
        console.log("Something went wrong.");
    };
    // Inquirer prompt to determine which employee is changing to which role
   try {
    await inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update?",
            choices: formattedEmployees,
            name: "employee"
        },
        {
            type: "list",
            message: "What role are we updating this employee to?",
            choices: formattedRoles,
            name: "newRole"
        },
    ])
    .then((result) => {
        // Deconstructs the Inquirer formatted employee name
        let employeeAsArray = result.employee.split(":");
        // Isolates the ID value from the formatted name
        let employeeID = employeeAsArray[0];
        // Deconstructs the Inquirer formatted role
        let roleAsArray = result.newRole.split(":");
        // Isolates the ID value from the formatted role
        let roleID = roleAsArray[0];

        // Query to update the chosen employee's role to the chosen new role
        connection.query(`UPDATE employee_trk_db.employees SET role_id = ${roleID} WHERE id = ${employeeID};`),
        // Something is off here - the query is running correctly but the result message isn't displaying. Tinker with this later - likely an async/await issue on account of the update query being part of the .then rather than using the await callbacks like in the preceding queries.
        function (err, result) {
            if (err) {
                console.error(err);
                homeMenu();
            } else {
                result(console.log(`\n${employeeAsArray[1]}'s role was updated successfully.\n`));
                viewEmployees();
            }
        }
    });
   }
   catch(err) {
    console.log(err);
   }
   console.log("\nThe employee's role was updated successfully.\n");
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
                break;
            default:
                return console.log("Something went really wrong.");
        }
    });
}

// App initialization function call

homeMenu();