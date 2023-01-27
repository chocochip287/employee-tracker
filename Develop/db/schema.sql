-- table and db setup here

-- db setup
-- db clear and refresh
DROP DATABASE IF EXISTS employee_trk_db;
CREATE DATABASE employee_trk_db;

-- sets viewed DB
USE employee_trk_db;

-- department table
CREATE TABLE departments (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
);

-- role table
CREATE TABLE roles (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
);

-- employee table
CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(id)
);