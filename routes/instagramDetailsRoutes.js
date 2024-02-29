const express = require("express");
const router = express.Router();
const axios = require("axios");
const control = require("../controllers/instagramDetailsControllers");
const app = express();
//creating the url for frtching instagram basic details
router.post("/details", control.instagramData);
//creating the url for frtching instagram comments details
// router.post("/comments", control.instagramRapidCommentData);
//creating the url for fetching instagram post counts on the basis of hashtag
router.post("/hashtag", control.Hashtag);
//creating the url for fetching instagram post counts on the basis of hashtag
router.post("/profile-details", control.channelProfile);
module.exports = router;
