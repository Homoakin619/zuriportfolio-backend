import { Router } from "express";
import { complaintController } from "../controllers/complaint.controller";
import { jwtAuth } from "../middlewares/verify";
import validate from "../middlewares/validate";
import { complaintValidation } from "../validation/complaint.validation";


export const complaintRouter = Router();


complaintRouter.post('/', validate(complaintValidation.userComplaint), jwtAuth.verifyToken, complaintController.createComplaint);