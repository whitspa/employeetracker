
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
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "Exit App",
        ]
      }
    ]).then((response) => {

      switch (response.Departments) {
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
        case "Update Employee Role":
          updateEmployeeRole();
          break;

        default:
          db.end()
          process.exit(0)

      }
    })
}

function viewDepartments() {
  db.query("Select * from department;", function (err, rows) {
    if (err) throw err;
    console.table(rows);
    init()
  })
}

function viewRoles() {
  db.query("select  r.title,r.salary, d.department_name from role r  left join department d on r.department_id = d.id order by d.department_name, r.title;",
    function (err, rows) {
      if (err) throw err;
      console.table(rows);
      init()
    })
}


function viewEmployee() {
  db.query
    ("select e.id,e.first_name,e.last_name, r.title,r.salary, d.department_name, m.first_name AS 'Manager FirstName', m.last_name AS 'Manager Last name' from employee e  left join role r on e.role_id = r.id  left join department d on r.department_id = d.id   left join employee m on e.manager_id = m.id  order by e.last_name;",
      function (err, rows) {
        if (err) throw err;
        console.table(rows);
        init()
      })
}

function addDepartment() {
  inquirer.prompt([{
    type: "input",
    message: "please enter department name",
    name: "department_name"
  }]).then(({ department_name }) => {


    db.query
      (`insert into department (department_name) values ("${department_name}");`,
        function (err, rows) {
          if (err) throw err;
          console.table(rows);
          init()
        })
  })
}

function addRole() {
  let departmentList = []
  db.query("select * from department;", function (err, data) {
    data.forEach((department) => {
      departmentList.push({ name: department.department_name, value: department.id })
    })

    inquirer.prompt([
      {
        type: "input",
        message: "Please enter role title",
        name: "title"
      },
      {
        type: "input",
        message: "Please enter role salary",
        name: "salary"
      },
      {
        type: "list",
        message: "Please enter department",
        name: "department_id",
        choices: departmentList
      },
    ])
      .then(({ title, salary, department_id }) => {


        db.query
          (`insert into role(title,salary,department_id) values ("${title}",${salary},${department_id});`,
            function (err, rows) {
              if (err) throw err;
              console.table(rows);
              init()
            })
      })
  })
}

function addEmployee() {
  let rolesList = []
  db.query("select * from role", function (err, data) {
    if (err) throw err;
    data.forEach(role => {
      rolesList.push({ name: role.title, value: role.id })
    })
    let manageridList = []
    db.query("select * from employee where manager_id is null;", function (err, data) {
      if (err) throw err;
      data.forEach(employee => {
        manageridList.push({ name: employee.first_name + " , " + employee.last_name, value: employee.id })
      })


      inquirer.prompt([
        {
          type: "input",
          message: "Please enter the employee first name",
          name: "first_name"
        },
        {
          type: "input",
          message: "Please enter the employee last name",
          name: "last_name"
        },
        {
          type: "list",
          message: "Please choose employee role",
          name: "role_id",
          choices: rolesList
        },
        {
          type: "list",
          message: "Please choose a manager id",
          name: "manager_id",
          choices: manageridList
        },
      ])
        .then(({ first_name, last_name, role_id, manager_id }) => {

          db.query
            (`insert into employee (first_name,last_name,role_id,manager_id)values("${first_name}","${last_name}",${role_id},${manager_id});`,
              function (err, rows) {
                if (err) throw err;
                console.table(rows);
                init()
              })
        })
    })
  })
}

function updateEmployeeRole() {
  let employeeList = []
  let rolesList = []
  db.query("select * from employee;", function (err, data) {
    if (err) throw err;
    data.forEach(employee => {
      employeeList.push({
        value: employee.id,
        name: `${employee.first_name} , ${employee.last_name}`
      })
    })
    db.query("select * from role;", function (err, data) {
      if (err) throw err;
      data.forEach(role => {
        rolesList.push({ name: role.title, value: role.id })
      })

      inquirer.prompt([
        {
          type: "list",
          message: "Please choose employee",
          name: "employee_id",
          choices: employeeList
        },
        {
          type: "list",
          message: "Please choose the new role",
          name: "role_id",
          choices: rolesList
        }
        // What's the user prompt? an employee to find? A list of employees from which to choose?
        // message: "please enter the role_id? you would like to update",
        // name: "role_id"

      ]).then(({ role_id, employee_id }) => {
        db.query
          (`update employee set role_id = ${role_id} where id = ${employee_id};`,
            function (err, rows) {
              if (err) throw err;
              console.table(rows);
              init()
            })
      })
    })
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















