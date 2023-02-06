
const mysql = require('mysql2');
const inquirer = require('inquirer');
 require('console.table');

function init() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Departments",
        message: "Please select what you would like to review",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Exit App"
        ]
      }
    ]).then((response) => {

         switch(response.Departments){
          case "View all Departments":
              viewDepartments();
              break;
          case "View all Employees":
              viewEmployee();
              break;
          case "View all Roles":
              viewRoles();
              break;
          case "Add Department":
              addDepartment();
              break;
          case "Add Employee":
              addEmployee();
              break;
          case "Add Role":
              addRole();
              break;

          default:
            db.end()
           process.exit(0)

         }
    })
}

function viewDepartments(){
  db.query("Select * from department;",function(err,rows){
    if(err) throw err;
    console.table(rows);
    init()
  })
}

function viewRoles(){
  db.query("select e.first_name,e.last_name, r.title,r.salary, d.department_name from employee e left join role r on e.role_id = r.id left join department d on r.department_id = d.id order by d.department_name, r.title;;",
  function(err,rows){
    if(err) throw err;
    console.table(rows);
    init()
  })
}


function viewEmployee(){
  db.query
  ("select e.first_name,e.last_name, r.title,r.salary, d.department_name, m.first_name AS 'Manager FirstName', m.last_name AS 'Manager Last name' from employee e  left join role r on e.role_id = r.id  left join department d on r.department_id = d.id   left join employee m on e.manager_id = m.id  order by e.last_name;",
  function(err,rows){
    if(err) throw err;
    console.table(rows);
    init()
  })
}


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: '',
    database: 'employees_db'
  })
db.connect(function () {
  console.log('Welcome to Employee tracker')
  init()
})















