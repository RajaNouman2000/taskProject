import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  to: {
    type: String,
  },
  subject: {
    type: String,
  },
  text: {
    type: String,
  },
});

const JobModel = mongoose.model("job", jobSchema);

export default JobModel;
