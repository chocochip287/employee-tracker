-- employee_trk_db seeds

-- departments seed

INSERT INTO employee_trk_db.departments (name) VALUES
("Marketing"),
("Research and Development"),
("Human Resources"),
("Loss Prevention"),
("Maintenance"),
("Leadership")
;

-- roles seed

INSERT INTO employee_trk_db.roles (title, salary, department_id) VALUES
("Elden Lord", 2500000, 6),
("Manager", 160000, 6),
("Social Media Specialist", 80000, 1),
("Advertising Specialist", 90000, 1),
("HR Representative", 75000, 3),
("Policy Specialist", 92000, 3),
("Research Scientist", 120000, 2),
("Product Technician", 140000, 2),
("LP Specialist", 80000, 4),
("Maintenance Engineer", 85000, 5),
("Facilities Specialist", 70000, 5)
;

-- employees seed

INSERT INTO employee_trk_db.employees (first_name, last_name, role_id, manager_id) VALUES
("Godfrey", "the First Elden Lord", 1, 1),
("Malenia", "Blade of Miquella", 2, 1),
("Morgott", "the Omen King", 2, 1),
("Ranni", "the Witch", 2, 1),
("Patches", "that Guy", 3, 2),
("Godrick", "the Grafted", 4, 2),
("Astel", "Naturalborn of the Void", 7, 4),
("Gideon", "Ofnir", 8, 4),
("Hoarah", "Loux", 5, 1),
("Commander", "Nial", 6, 1),
("Margit", "the Fell Omen", 9, 3),
("Tree", "Sentinel", 11, 3),
("Mohg", "the Omen", 10, 3)
;