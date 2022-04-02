import mongoose from "mongoose";

// schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    requried: true,
  },
  id: {
    type: String,
  },
});

// model
const User = mongoose.model("User", userSchema);

export default User;
