import express, { Router } from "express";
import { sayHelloController } from "../controllers/greeting.controller";

export const greetingRouter = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get a greeting message
 *     description: Retrieve a greeting message using a GET request.
 *     tags: [Greeting]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
greetingRouter.get("/", sayHelloController);