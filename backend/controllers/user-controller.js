const User = require("../models/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Video = require("../models/video.schema");

const createTokenUsername = (username) => {
  return jwt.sign({ username }, process.env.SECRET);
};
const createTokenLogin = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "300s" });
};
// const createTokenVideo = (title) => {
//   return jwt.sign({ title }, process.env.SECRET);
// };

const signupUser = async (req, res) => {
  const { username, password, genre } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const token = createTokenUsername(username);
      const salt = await bcrypt.genSalt(10);
      const hashPassWord = await bcrypt.hash(password, salt);
      const user = new User({
        username,
        password: hashPassWord,
        genre,
        token,
      });
      await user.save();
      res.status(200).json({
        message:
          "Vous venez de vous inscrire sur le site, veuillez maintenant vous connecter",
      });
    } else {
      res.status(400).json({
        message: "Username déjà existant",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      if (user.token) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = createTokenLogin(user._id);
          res.status(200).json({ user, token });
        } else {
          res.status(400).json({ message: "Mauvais Username et/ou Password" });
        }
      } else {
        res.status(400).json({ message: "Username non existant" });
      }
    } else {
      res.status(400).json({ message: "Mauvais Username et/ou Password" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const newVideo = async (req, res) => {
  const { videoUrl, title, user } = req.body;
  const parsedUser = JSON.parse(user);
  console.log(req.body);
  try {
    const video = await Video.findOne({ videoUrl });
    if (!video) {
      const video = new Video({
        videoUrl,
        title,
        user: parsedUser,
      });
      await video.save();
      res.status(200).json({ video });
    } else {
      res.status(400).json({
        message: "Vidéo déjà existante",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const allVideos = await Video.find({});
    res.status(200).json(allVideos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, newVideo, getAllVideos };
