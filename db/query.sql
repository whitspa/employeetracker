USE employees_db;


select e.first_name,e.last_name, r.title,r.salary, d.department_name
from employee e
left join role r on e.role_id = r.id
left join department d on r.department_id = d.id
order by d.department_name, r.title;


select * from employee;


select * from department;

select e.first_name,e.last_name, r.title,r.salary, d.department_name,
m.first_name AS 'Manager FirstName', m.last_name AS 'Manager Last name'
from employee e
left join role r on e.role_id = r.id
left join department d on r.department_id = d.id
left join employee m on e.manager_id = m.id
order by e.last_name;

INSERT INTO department (department_name)
  VALUES ("Accounting");
  
