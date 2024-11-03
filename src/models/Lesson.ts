import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    default: "",
  },
  lesson: {
    type: Boolean,
    default: true
  },
  steps: {
    type: [
      {
        description: {
          type: String,
          default: "",
        },
        workspaceState: {
          type: Object,
          default: {},
        },
        image: {
          ref: String,
          url: String
        }
      },
    ],
    default: [{
      description: "",
      workspaceState: {},
    }]
  },
  variant: {
    type: String,
    required: true,
    enum: ["backend", "frontend"],
  },
  uid: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
  },
  public: {
    type: Boolean,
    default: false
  }
});

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
