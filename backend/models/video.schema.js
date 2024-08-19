const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoUrl: { type: String, required: true },
    title: { type: String, required: true },
    user: {
      username: { type: String, required: true },
      password: { type: String, required: true },
      genre: { type: String, required: true },
      token: String,
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoSchema);
