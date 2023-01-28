-- seeds go brrrr (employee_trk_db.xxxxxx)

-- sample insert into from SQL Day 3 office hours for reference
-- INSERT INTO flights (flight_number, start_time, end_time, start_place, end_place) values
-- ('A100', '2022-11-24 18:00', '2022-11-24 19:00', 'EWR', 'CAN'),
-- ('A100', '2022-11-26 18:00', '2022-11-26 19:00', 'CAN', 'EWR');
-- above is an example of an insert many - there are multiple rows being added to flights here.

-- same thing but using SET
--INSERT INTO flights SET
--flight_number="A100",
--start_time= 'sometime',
--end_time= 'sometime',
--start_place= 'someplace',
--end_place= 'someplace',;

-- update reminder from exercise 10 in module 12 for reference
-- UPDATE books_db.fiction
-- SET name = "Candide" WHERE id = 2;

-- departments seed

INSERT INTO employee_trk_db.departments (name) VALUES,
("Marketing"),
("Research and Development"),
("Human Resources"),
("Loss Prevention"),
("Maintenance");

-- roles seed


-- employees seed