import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, dueDate } = req.body;

    if (!title || !project || !assignedTo) {
      return res.status(400).json({ message: "Title, project, and assignedTo are required" });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Task creation failed", error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssignedUser = task.assignedTo.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isAssignedUser) {
      return res.status(403).json({ message: "You can update only your assigned tasks" });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Status update failed", error: error.message });
  }
};