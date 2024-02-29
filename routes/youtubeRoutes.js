const express = require("express");
const router = express.Router();
const axios = require("axios");
const control = require("../controllers/youtubeControllers");
const app = express();
//youtube video details on the basis of keyword route
router.post("/video-id", control.videoId);
//youtube video details on the basis of video id route
router.post("/video-details", control.searchVideo);
//youtube channel details on the basis of keyword route
router.post("/channel-details", control.searchChannel);
//youtube channel details on the basis of keyword route
// router.post("/channel-id", control.channelId);
//getting video on the basis of video-id route
// router.post("/video", control.videoOnBasisOfId);
//getting channel details on the basis of channel-id route
// router.post("/channel", control.channelOnBasisOfId);
//getting count on the basis of hashtag route
router.post("/hashtag",async (req, res) => {
    try {
      const hashtag = req.body.hashtag; // Get the hashtag from the query parameter
      if (!hashtag) {
        return res.status(400).json({ error: 'Hashtag is required' });
      }
  
      const { videoList, videoCount } = await control.Hashtag(hashtag);
  
      res.json({ hashtag, videoCount, videoList });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Error fetching videos' });
    }
  });;
//getting autosuggest search on the basis of keyword route
router.post("/auto-suggest", control.autoSuggest);
//getting autosuggest search on the basis of keyword route
router.post("/filter", control.autoSuggest);
//getting comment count on the basis of keyword route
// router.post("/comment-count", control.commentOnBasisOfId);
//getting activity of a particular user route
router.post("/activity", control.activity);
//getting retrospective data of a particular user route
router.post("/retrospective", control.retrospective);
//getting retrospective data of a particular user route
router.post("/posts", control.posts);
//getting channel details on the baisi of video id route
router.post("/video-channel", control.detailsOnTheBasisOfChannelId);
//getting channel details on the baisi of video id route
// router.post("/channel-jd-avatar", control.getJoinDateNdAvatar);
//getting profile details route
router.post("/profile-details", control.channelProfile);
//getting particular video details route
router.post("/particular-video-details", control.videDetails);
//getting videos on the basis of filters route
router.post("/video-filters", control.videoFilter);
//getting category id and category names route
router.post("/catId", control.categoryId);
//getting country code and country names route
router.post("/country", control.countryCode);
module.exports = router;
