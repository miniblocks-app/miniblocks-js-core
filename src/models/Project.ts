import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  saveData: {
    type: Object,
  },
  variant: {
    type: String,
    required: true,
    enum: ["backend", "frontend"],
  },
  mode: {
    type: String,
    default: "default",
    enum: ["default", "lesson"],
  },
  lessonId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  lessonStep: {
    type: Number,
    default: 0
  },
  uid: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
  },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
