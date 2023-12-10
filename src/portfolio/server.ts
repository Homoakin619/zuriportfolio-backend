import { connectionSource } from "./database/data-source";
import express from "express";
import application from "../checkout/app";
import * as entities from "./database/entities";
import { readdirSync } from "fs";
import { sayHelloController } from "./controllers/greeting.controller";
import cors from "cors";
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger");
import { errorHandler } from "./middlewares/index";
import { logger } from "../checkout/config/logger";

// const app = express();

//  Swagger UI
application.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// connectionSource
//   .initialize()
//   .then(async () => {
//     logger.info("Portfolio Database Connected");
//   })
//   .catch((error) => console.log(error));

// middleware setup

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

//serve all routes dynamically using readdirsync
readdirSync("./src/portfolio/routes").map((path) =>
  application.use("/api/v1/portfolio", require(`./routes/${path}`))
);
application.get('/dev', (req, res) => {
	res.send('Welcome to Developer Cart API. Visit /docs for API documentation');
});
application.get("/api", sayHelloController);
application.use("/api/v1/portfolio",errorHandler);

export default application
