import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    const tasks = await Task.find(filter);

    const today = new Date();

    res.json({
      totalTasks: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter(
        (t) => t.dueDate && t.dueDate < today && t.status !== "done"
      ).length,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};