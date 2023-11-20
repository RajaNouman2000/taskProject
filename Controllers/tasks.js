import Task from "../models/Task.js";

export const addTask = async (req, res) => {
  const { title, description, status, assignedUser } = req.body;
  const task = await Task.create({
    title,
    description,
    status,
    assignedUser,
  });
  res.send("is Admin User");
};

export const deleteTask = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    // Soft delete the task by updating the 'deleted' field to true
    const deletedTask = await Task.delete({ _id: taskId });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    const allTasks = await Task.find({});
    console.log(allTasks);

    res.json({ message: "Task soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
