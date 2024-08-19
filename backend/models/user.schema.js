const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    genre: { type: String, required: true },
    // likes: { type: String, required: true },
    // dislikes: { type: String, required: true },
    token: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
