import express, { NextFunction, Request, Response } from "express";
import employeesService from "../5-services/employees-service";
import StatusCode from "../3-models/status-code";
import EmployeeModel from "../3-models/employee-model";

// Create the router part of express:
const router = express.Router()

// Get http://loaclhost:4000/api/employees
router.get("/employees", async (request: Request, response: Response, next: NextFunction) => {

    try {

        // Get all products from database:
        const employees = await employeesService.getAllEmployees();

        // Response back all employees:
        response.json(employees);
    }
    catch (err: any) {
        next(err);
    }
});

// Get http://loaclhost:4000/employees/:id
router.get("/employees/:id", async (request: Request, response: Response, next: NextFunction) => {

    try {
        // Get route id:
        const id = + request.params.id;

        // Get one products from database:
        const employee = await employeesService.getOneEmployee(id);

        // Response back all employees:
        response.json(employee);
    }
    catch (err: any) {
        next(err);
    }
});

// POST http://loaclhost:4000/employees
router.post("/employees", async (request: Request, response: Response, next: NextFunction) => {

    try {
        // Get employee send from frontend
        const employee = new EmployeeModel( request.body);

        // Add product to database:
        const addedEmployee = await employeesService.addEmployee(employee);

        // Response back all employees:
        response.status(StatusCode.Created).json(employee);

    }
    catch (err: any) {
        next(err);
    }
});

// PUT http://loaclhost:4000/employees/:id
router.put("/employees/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Extract route id into body:
        request.body.id = +request.params.id;

        // Get employee send from frontend
        const employee = new EmployeeModel( request.body);


        // Update employee in database:
        const updatedEmployee = await employeesService.updateEmployee(employee);

        // Response back all employees:
        response.json(updatedEmployee);
    }
    catch (err: any) {
        next(err);
    }
});

// DELETE http://loaclhost:4000/employees/:id
router.delete("/employees/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Get route id:
        const id = +request.params.id;


        // delete employee in database:
        await employeesService.deleteEmployee(id);

        // Response back:
        response.sendStatus(StatusCode.NoContent);
    }
    catch (err: any) {
        next(err);
    }
});

// Export the above router
export default router;