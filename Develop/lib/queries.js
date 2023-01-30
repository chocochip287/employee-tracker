// Storing lengthier queries for leaner functions in index.js

// View Employees query
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
END AS manager

FROM employee_trk_db.employees

INNER JOIN employee_trk_db.roles ON employees.role_id = roles.id
INNER JOIN employee_trk_db.departments ON roles.department_id = departments.id
;`

const getEmployeesForUpdate = 
`
SELECT
id,
CONCAT(first_name, ' ', last_name) as employee_name

FROM employee_trk_db.employees

WHERE role_id != 1 AND role_id != 2
;`

const getRolesForUpdate = 
`
SELECT
id,
title

FROM employee_trk_db.roles

WHERE roles.id != 1 AND roles.id != 2
;`

const setNewRole =
`
UPDATE employee_trk_db.employees

SET role_id = 
WHERE id = 
;
`

module.exports = {
    employeeQuery,
    getEmployeesForUpdate,
    getRolesForUpdate
}