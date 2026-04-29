import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = await Project.create({
      name,
      description,
      members,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find().populate("members", "name email");
    } else {
      projects = await Project.find({
        members: req.user._id,
      });
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};