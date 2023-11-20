import express from "express";
import authenticateMiddleware from "../middleware/auth.js";

import { addTask, deleteTask } from "../Controllers/tasks.js";

const taskRouter = express.Router();
taskRouter.use(express.urlencoded({ extended: true }));

taskRouter.post("/addtask", authenticateMiddleware, addTask);
taskRouter.post("/deletetask/:taskId", authenticateMiddleware, deleteTask);

export default taskRouter;
