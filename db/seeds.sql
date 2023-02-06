USE employees_db;


insert into department(department_name)values
('Sales'),
('Production'),
('Logistics');

insert into role(title,salary,department_id)values
('Manager of Sales',12987,1),
('Manager of Production',29384,2),
('Manager of Logistics',23942,3),
('Sales Associate',12987,1),
('Production Associate',29384,2),
('Logistics Associate',23942,3);

insert into employee(first_name,last_name,role_id,manager_id)values
('Fred','smith',1,NULL),
('Susan','Jones',2,NULL),
('Jans','Ngyuen',3,NULL),
('Ed','jenks',4,1),
('dorris','day',5,2),
('elenore','rigby',6,3);
