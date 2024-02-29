const express = require("express");
const router = express.Router();
const moment = require('moment');
const brand = require("../controllers/brandanalysisControllers");
const test=require('../controllers/testControllers')
const app = express();
//creating the url for frtching instagram basic details
router.post("/video-details", brand.getVideoMetricsForChannel);

// Define a route to get audience demographics
router.get('/audience-demographics', brand.audienceDemographics);

  // Define a route to get engagement metrics for a specific video
router.get('/engagement-metrics', async (req, res) => {
    try {
      const videoId = req.body.videoId;
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }
  
      const metrics = await brand.getEngagementMetrics(videoId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching engagement metrics' });
    }
  });

  // Define a route to get competitor channel information
router.get('/competitor-info', async (req, res) => {
    try {
      const competitorChannels = ['CompetitorChannel1ID', 'CompetitorChannel2ID']; // Add competitor channel IDs
  
      const competitorInfo = [];
      for (const channelId of competitorChannels) {
        const channelData = await brand.getChannelInfo(channelId);
        competitorInfo.push(channelData);
      }
  
      res.json(competitorInfo);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Define a route to perform sentiment analysis
// router.post('/analyze-sentiment', (req, res) => {
//     const textToAnalyze = req.body.text;
//     const sentimentScore = brand.analyzeSentiment(textToAnalyze);
  
//     res.json({ sentimentScore });
//   });

  //creating the url for fetching for treniding topics on the basis of region
    router.post("/trendings", brand.trendingTopics);

    router.post("/hashtag-percentage",brand.getHashtagsUsage);

    router.post('/mentions',brand.mentionsPerDay);

    router.post('/channel-mentions',brand.channelMentionsPerDay);

    router.post('/ads', async (req, res) => {
        const channelId = req.body.channelId; // Replace with the desired channel ID
      
        const adsPerDay = await brand.getAdsPerDayForChannel(channelId);
      
        // Calculate the total ads per day
        const totalAdsPerDay = Object.values(adsPerDay).reduce((total, count) => total + count, 0);
      
        // Calculate the daily count of ads for the last 7 days
        const today = moment().format('YYYY-MM-DD');
        const last7Days = Array.from({ length: 7 }, (_, index) => {
          const date = moment(today).subtract(index, 'days').format('YYYY-MM-DD');
          return { date, count: adsPerDay[date] || 0 };
        });
      
        const results = {
          totalAdsPerDay,
          dailyAds: last7Days,
        };
      
        res.json(results);
      });


    router.post('/engagementPaid', async (req, res) => {
        const channelId = req.body.channelId;
        const channelData = await test.getChannelStatistics(channelId);
        res.json(channelData);
      });

      router.post('/audience-location',brand.audienceLocation);

      router.post('/growth', async (req, res) => {
        const channelId  = req.body.channelId;
      
        try {
            const channelStats = await test.fetchChannelStatistics(channelId);
            const dailyData = await test.fetchDailyData(channelId);
        
            res.json({ channelStats, dailyData });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching data' });
          }
        });

        router.post('/mentioned-channels',brand.brandMentions);

            router.post('/frequency/:channelId', async (req, res) => {
                const channelId= req.params.channelId;
              
                try {
                  const postFrequencyPercentage = await brand.frequency(channelId);
              
                  res.json({ postFrequencyPercentage });
                } catch (error) {
                  console.error(error);
                  res.status(500).json({ error: 'An error occurred while calculating post frequency' });
                }
              });

              router.post('/percentage/:channelId', async (req, res) => {
                const { channelId } = req.params;
              
                try {
                  const demographicsPercentage = await brand.calculateDemographicsPercentage(channelId);
              
                  res.json(demographicsPercentage);
                } catch (error) {
                  console.error(error);
                  res.status(500).json({ error: 'An error occurred while calculating demographics percentage' });
                }
              });
            


module.exports = router;
