import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "fail"],
    default: "pending",
  },
  // Reference to the user schema
  assignedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Refers to the 'User' model
  },
  // Add other fields as needed for your tasks
  // ...
});

// Apply the mongoose-delete plugin to the taskSchema
taskSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

// Create the Task model
export const Task = mongoose.model("Task", taskSchema);

export default Task;
