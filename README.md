# Employee Tracker

## License

This application uses an MIT license.

## Description

This Employee Tracker allows a user to perform CRUD operations on a company database with tables containing department, role, and employee data. Presently, the application supports read operations for all information in the database as well as create operations for new employees, roles, and/or departments. Functionality to update existing entries in the DB is in the works.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [License](#license)

## Installation Instructions

Once the repo has been cloned to your personal machine, run npm i in your machine's terminal to install the required Node.js packages. Please note that this application requires MySQL to be installed on the user's system. Please follow the instructions at the [MySQL Website](https://dev.mysql.com/doc/refman/8.0/en/installing.html) to ensure you are able to run MySQL in your CLI. MySQL Workbench is also recommended for additional database operations.

From your terminal's CLI run the commands mysql -u (your username) -p < schema.sql and mysql -u (your username) -p < seed.sql. You will need to input your password for each file. Please ensure that you update the user credentials in the connection.js file under the Develop/db directory.

Once the schema and seed files have been run, type node index from the application's main directory to start the program.

## Usage

All user facing operations for this application can be performed from the user's terminal once the application is running. Each operation is straightforward and prompts the user for any inputs or information required.

Additionally, [this video](https://www.youtube.com/watch?v=Vhu9nH_O0qE) demonstrates all of the application's functionality.

## Tests

None for this application.

## Questions

None for now.

## App Author

chocochip287 - [GitHub](https://github.com/chocochip287)

## Author's Email

chocochip287@gmail.com