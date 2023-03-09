// Storing lengthier queries for leaner functions in index.js

// View Employees query - the case adds a manager column that sets the manager's name based on the manager_id assigned to the given employee
const employeeQuery = 
`select 
employees.id,
employees.first_name,
employees.last_name,
roles.title,
departments.name AS department,
roles.salary,
CASE
	WHEN manager_id = 1 THEN "Godfrey"
    WHEN manager_id = 2 THEN "Malenia"
    WHEN manager_id = 3 THEN "Morgott"
    WHEN manager_id = 4 THEN "Ranni"
    WHEN manager_id is NULL THEN ""
END AS manager

FROM employee_trk_db.employees

INNER JOIN employee_trk_db.roles ON employees.role_id = roles.id
INNER JOIN employee_trk_db.departments ON roles.department_id = departments.id
;`

// Selects employees that are not in leadership, indicated by role_id not being equal to 1 or 2
const getEmployeesForUpdate = 
`
SELECT
employees.id,
CONCAT(employees.first_name, ' ', employees.last_name) as employee_name,
roles.title

FROM employee_trk_db.employees

LEFT JOIN employee_trk_db.roles on employee_trk_db.employees.role_id = employee_trk_db.roles.id

WHERE role_id != 1 AND role_id != 2
;`

// Selects roles that are not leadership roles, indicated by role_id not being equal to 1 or 2
const getRolesForUpdate = 
`
SELECT
id,
title

FROM employee_trk_db.roles

WHERE roles.id != 1 AND roles.id != 2
;`

module.exports = {
    employeeQuery,
    getEmployeesForUpdate,
    getRolesForUpdate
}