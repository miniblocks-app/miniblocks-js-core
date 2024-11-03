import mongoose from "mongoose";

const sandboxSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  containerId: {
    type: String,
    required: true
  },
  stopped: {
    type: Boolean,
  }
});

const Sandbox = mongoose.model("Sandbox", sandboxSchema);

export default Sandbox;
