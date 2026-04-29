import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createTask);
router.get("/", protect, getTasks);
router.put("/:id/status", protect, updateTaskStatus);

export default router;