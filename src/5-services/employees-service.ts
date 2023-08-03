import { OkPacket } from "mysql";
import dal from "../2-utils/dal";
import EmployeeModel from "../3-models/employee-model";

import { ResourceNotFoundError } from "../3-models/error-models";


// Get all employees
async function getAllEmployees(): Promise<EmployeeModel[]> {

    //Create sql:
    const sql = 'SELECT employeeID as employeeId ,firstName as firstName , lastName as lastName,birthDate as birthDate , country as country ,city as city  FROM employees';

    // Get employees from database;
    const employees = await dal.execute(sql);

    //Return employees:
    return employees;
}


// Get one employee
async function getOneEmployee(id: number): Promise<EmployeeModel> {

    //Create sql:
    const sql = `SELECT employeeID as employeeId
     ,firstName as firstName , lastName as lastName,
     birthDate as birthDate , country as country ,
     city as city  FROM employees
     where employeeID =${id}  `;

    // Get employee from database containing onr employee;
    const employees = await dal.execute(sql);

    // Extract the single employee
    const employee = employees[0];

     // If no such employee:
     if (!employee) throw new ResourceNotFoundError(id);

    //Return employee:
    return employee;
}

// add one employee
async function addEmployee(employee: EmployeeModel): Promise<EmployeeModel> {

    employee.validate();

    //Create sql
    const sql = `INSERT INTO employees(firstName, lastName, birthDate,country,city)
    VALUES('${employee.firstName}', '${employee.lastName}', '${employee.birthDate}', '${employee.country}', '${employee.city}')`;

    // Execute sql,get back info object
    const info: OkPacket = await dal.execute(sql);

    // Extract new id, set it back in the given employee
    employee.id = info.insertId

    // Return added employee
    return employee;

}

// Update employee
async function updateEmployee(employee: EmployeeModel): Promise<EmployeeModel> {

    employee.validate();


    //Create sql
    const sql = `UPDATE EMPLOYEES SET 
                firstName = '${employee.firstName}',
                lastName = '${employee.lastName}',
                birthDate = '${employee.birthDate}',
                country = '${employee.country}',
                city = '${employee.city}'
                WHERE employeeId = '${employee.id}'`;

    // Execute sql,get back info object
    const info: OkPacket = await dal.execute(sql);

    
    // If no such product:
    if (info.affectedRows === 0) throw new ResourceNotFoundError(employee.id);

    // Return added employee
    return employee;

}

// Delete employee
async function deleteEmployee(id: number): Promise<void> {

    //Create sql
    const sql = `DELETE from employees WHERE employeeId =${id}`;

    // Execute sql,get back info object
    const info: OkPacket = await dal.execute(sql);

}

export default {
    getAllEmployees,
    getOneEmployee,
    addEmployee,
    updateEmployee,
    deleteEmployee
};