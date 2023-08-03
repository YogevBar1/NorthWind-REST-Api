
import express from "express";
import appConfig from "./2-utils/app-config";
import productsController from "./6-controllers/products-controller";
import employeesController from "./6-controllers/employees-controller";
import verbose from "./4-middleware/verbose";
import doorman from "./4-middleware/doorman";
import sabbathForbidden from "./4-middleware/sabbath-forbidden";
import catchAll from "./4-middleware/catch-all";
import routeNotFound from "./4-middleware/route-not-found";
import authController from "./6-controllers/auth-controller";
import expressFileUpload from "express-fileupload";

// Create the server
const server = express();

// Support request.body as JSON:
server.use(express.json());

// Support file upload - set files into request
server.use(expressFileUpload());

// Connect app- level middleware
server.use(verbose);
server.use(doorman);
server.use(sabbathForbidden);

// Route requests to our controllers
server.use("/api" , productsController);
server.use("/api" , employeesController);
server.use("/api" , authController);

// Route not found
server.use("*", routeNotFound)

// Catch all middleware
server.use(catchAll);

// Run server:
server.listen(appConfig.port,()=>console.log("Listening on http://localhost:" + appConfig.port));