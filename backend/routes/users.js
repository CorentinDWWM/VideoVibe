const {
  signupUser,
  loginUser,
  newVideo,
  getAllVideos,
} = require("../controllers/user-controller");

const router = require("express").Router();

router.post("/signup", signupUser);

router.post("/signin", loginUser);

router.post("/addVideos", newVideo);

router.get("/videos", getAllVideos);

module.exports = router;
