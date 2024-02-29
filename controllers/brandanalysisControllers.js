const { google } = require('googleapis');
const axios = require('axios');
const moment = require('moment');
const { json } = require('body-parser');
require("dotenv").config();

// const natural = require('natural');
// const analyzer = new natural.SentimentAnalyzer();
// const stemmer = natural.PorterStemmer;

// Load your API key JSON file
const api_key = process.env.api_key;



// Set up the YouTube Data API client
const youtube = google.youtube({
    version: 'v3',
    auth: api_key,
  });
const youtubeAnalytics = google.youtubeAnalytics({
    version: 'v2',
    auth: api_key,
  });

module.exports={
    // Function to fetch video metrics for a channel
    getVideoMetricsForChannel:async(req,res)=>
    {
        try {
          // Define the channel ID (you can find this in the channel's URL)
          const channelId = req.body.channelId;

          const channelVideosResponse = await youtube.search.list({
            channelId: channelId,
            type: 'video',
            part: 'id',
            maxResults: 50, // You can adjust the number of videos to retrieve
          });
      
          const videoIds = channelVideosResponse.data.items.map((item) => item.id.videoId);
          const videoMetrics = [];
      
          // Retrieve metrics for each video
          for (const videoId of videoIds) {
            const videoResponse = await youtube.videos.list({
              id: videoId,
              part: 'statistics',
            });
      
            const video = videoResponse.data.items[0];
            videoMetrics.push({
              videoId: videoId,
              views: video.statistics.viewCount,
              likes: video.statistics.likeCount,
              dislikes: video.statistics.dislikeCount,
              comments: video.statistics.commentCount,
            });
          }
          const Number_of_Videos= channelVideosResponse.data.pageInfo.totalResults
          const subscribers= await axios.get(`https://www.googleapis.com/youtube/v3/channels?key=${api_key}&id=${channelId}&part=statistics`);
          const subscriberCount=subscribers.data.items[0].statistics.subscriberCount;

      
          // Calculate total and average views
          const totalViews = videoMetrics.reduce((total, video) => total + parseInt(video.views), 0);
          const averageViews = totalViews / Number_of_Videos;
      
          // Display the video metrics
          res.json({
            SubscriberCount:subscriberCount,
            Number_of_Videos:Number_of_Videos,
            Total_Views: totalViews,
            Average_Views_per_Video: averageViews,
            Video_Metrics: videoMetrics
          })
        } catch (error) {
          res.json({
            Error: error
          });
        }
      
    },

    audienceDemographics:async(req,res)=>{

// Create a YouTube Analytics client
const youtubeAnalytics = google.youtubeAnalytics('v2');

// Set the channel ID for the YouTube channel you want to analyze
const channelId = 'YOUR_CHANNEL_ID';

// Set the start and end dates for the report
const startDate = 'YYYY-MM-DD';
const endDate = 'YYYY-MM-DD';

// Set the metrics and dimensions you want to retrieve
const metrics = 'views,comments,likes,dislikes,shares';
const dimensions = 'ageGroup,gender';

// Set the filters if needed
const filters = 'video==VIDEO_ID'; // You can filter by video if necessary

// Make the request to retrieve audience demographics data
youtubeAnalytics.reports.query(
  {
    auth: null, // No authentication required for public channel data
    ids: `channel==${channelId}`,
    startDate,
    endDate,
    metrics,
    dimensions,
    filters,
  },
  (err, response) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Audience Demographics Data:', response.data.data);
    }
  }
);
    },

    getEngagementMetrics:async(videoId)=>{
    try {
      const response = await axios.get(`('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          key: api_key,
          part: 'statistics',
          id: videoId,
        },
      });`)
  
      return response.data.items[0].statistics;
    } catch (error) {
      throw error;
    }
  },

  getChannelInfo:async(channelId)=>{
    try {
      const response = await youtube.channels.list({
        id: channelId,
        part: 'snippet,statistics',
      });
  
      return response.data.items[0];
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  // analyzeSentiment:async(text)=>{
  //   const tokens = new natural.WordTokenizer().tokenize(text);
  //   const stemmedTokens = tokens.map(token => stemmer.stem(token));
  //   const sentiment = analyzer.getSentiment(stemmedTokens);
  //   return sentiment;
  // },

  trendingTopics:async(req,res)=>{
    const regionCode=req.body.code
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            chart: 'mostPopular',
            regionCode:regionCode, // Set the region code to your desired region
            key: api_key, // Replace with your YouTube Data API key
          },
        });
    
        const trendingVideos = response.data.items;
        res.json(trendingVideos);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },

    getHashtagsUsage:async(req,res)=> {
      try {
        const channelId=req.body.channelId
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${api_key}&channelId=${channelId}&part=snippet&type=video&maxResults=50`);
        const videos = response.data.items;
    
        const hashtagCounts = {};
    
        videos.forEach(video => {
          const videoDescription = video.snippet.description;
          const hashtags = videoDescription.match(/#(\w+)/g);
    
          if (hashtags) {
            hashtags.forEach(hashtag => {
              hashtag = hashtag.toLowerCase();
              if (hashtagCounts[hashtag]) {
                hashtagCounts[hashtag]++;
              } else {
                hashtagCounts[hashtag] = 1;
              }
            });
          }
        });
    
        const totalHashtags = Object.values(hashtagCounts).reduce((a, b) => a + b, 0);
    
        const hashtagUsage = [];
        for (const hashtag in hashtagCounts) {
          const percentage = (hashtagCounts[hashtag] / totalHashtags) * 100;
          hashtagUsage.push({ hashtag, percentage: percentage.toFixed(2) });
        }
    

        res.status(200).json(hashtagUsage);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching hashtags', details: error });
      }

},

//mentions per day
mentionsPerDay:async(req,res)=>{
  const videoId=req.body.videoId
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${api_key}`);
    const videoData = response.data.items[0];

    if (videoData) {
      const videoTitle = videoData.snippet.title;
      const viewCount = videoData.statistics.viewCount;
      const commentCount = videoData.statistics.commentCount;
      const mentionsPerDay = commentCount / (viewCount / 7); // Assuming 7 days per week

      res.json({
        mentionsPerDay:mentionsPerDay.toFixed(2)
      })
    }
  } catch (error) {
    res.json('Error retrieving video data:', error);
  }

},

channelMentionsPerDay:async(req,res)=>{
  const channelId=req.body.channelId
  try {
    // Get the playlist for uploads of the channel
    const playlistResponse = await youtube.playlists.list({
      part: 'contentDetails',
      channelId: channelId,
    });

    if (playlistResponse.data.items.length === 0) {
      console.log('Channel has no playlists.');
      return;
    }

    const uploadPlaylistId = playlistResponse.data.items[0].id;

    // Get all videos in the upload playlist
    const videosResponse = await youtube.playlistItems.list({
      part: 'snippet',
      maxResults: 50, // Adjust as needed
      playlistId: uploadPlaylistId,
    });

    const videoDataArray = videosResponse.data.items;

    // Create an array to store promises for video data retrieval
    const videoPromises = [];

    // Calculate mentions per day and organize them by day
    const mentionsByDay = {};

    videoDataArray.forEach(async (item) => {
      const videoId = item.snippet.resourceId.videoId;
      const videoDate = new Date(item.snippet.publishedAt);

      // Add a promise for each video data retrieval
      videoPromises.push(
        axios
          .get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${api_key}`)
          .then((response) => {
            const videoData = response.data.items[0];
            if (videoData) {
              const viewCount = videoData.statistics.viewCount;
              const commentCount = videoData.statistics.commentCount;
              const mentionsPerDay = commentCount / (viewCount / 7); // Assuming 7 days per week

              // Format the date as "YYYY-MM-DD" to use it as the key
              const formattedDate = videoDate.toISOString().split('T')[0];

              if (mentionsByDay[formattedDate]) {
                mentionsByDay[formattedDate] += mentionsPerDay;
              } else {
                mentionsByDay[formattedDate] = mentionsPerDay;
              }
            }
          })
      );
    });

    // Wait for all video data promises to resolve
    await Promise.all(videoPromises);

    // Sort the mentions by date
    const sortedMentions = Object.entries(mentionsByDay).sort((a, b) => a[0].localeCompare(b[0]));

    // Calculate the total mentions per day
    let totalMentionsPerDay = 0;
    sortedMentions.forEach(([date, mentions]) => {
      totalMentionsPerDay += mentions;
    });

    // Print total mentions per day
    // console.log('Total Mentions Per Day:', totalMentionsPerDay);

    // Print mentions per day for the last 7 days
    const last7Days = sortedMentions.slice(-7);

    const results = {
      totalMentionsPerDay,
      dailyMentions: last7Days.map(([date, mentions]) => ({ date, mentions })),
    };

    // Send the results as a JSON response
    res.json(results);
  } catch (error) {
    // console.error('Error retrieving channel data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving channel data.' });
  }
},

getAdsPerDayForChannel:async(channelId)=>{
  const adsPerDay = {};

  try {
    // Get the playlist for uploads of the channel
    const playlistResponse = await youtube.playlists.list({
      part: 'contentDetails',
      channelId: channelId,
    });

    if (playlistResponse.data.items.length === 0) {
      console.log('Channel has no playlists.');
      return;
    }

    const uploadPlaylistId = playlistResponse.data.items[0].id;

    // Get all videos in the upload playlist
    const videosResponse = await youtube.playlistItems.list({
      part: 'snippet',
      maxResults: 50, // Adjust as needed
      playlistId: uploadPlaylistId,
    });

    const videoDataArray = videosResponse.data.items;

    for (const item of videoDataArray) {
      const videoId = item.snippet.resourceId.videoId;
      const videoDate = new Date(item.snippet.publishedAt);

      // Fetch video data
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,statistics&key=${api_key}`);
      const videoData = response.data.items[0];

      if (videoData) {
        const videoTitle = videoData.snippet.title.toLowerCase(); // Consider case-insensitive search

        // Check if the video title contains keywords indicating an ad
        if (videoTitle.includes('ad') || videoTitle.includes('commercial')) {
          const formattedDate = moment(videoDate).format('YYYY-MM-DD');

          if (adsPerDay[formattedDate]) {
            adsPerDay[formattedDate]++;
          } else {
            adsPerDay[formattedDate] = 1;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error retrieving channel data:', error);
  }

  return adsPerDay;
},

audienceLocation:async(req,res)=>{
  const channelId=req.body.channelId

  try {
    // Fetch the list of subscribers for the channel.
    const subscribersResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/subscriptions?key=${api_key}&channelId=${channelId}&part=snippet&maxResults=50`
    );

    const subscribers = subscribersResponse.data.items;

    // Extract subscribers' location data.
    const locations = subscribers.map((subscription) => {
      const snippet = subscription.snippet;

      // Check if location data is available for this subscriber.
      if (snippet.country) {
        const location = {
          country: snippet.country,
          channelTitle: snippet.channelTitle,
        };
        return location;
      }
    });

    // Filter out any null values (subscribers without location data).
    const validLocations = locations.filter((location) => location);

    res.status(200).json(validLocations);
  } catch (error) {
    console.error('Error retrieving subscribers location data:', error);
    res.status(500).json({ error: error });
  }
},

growth:async(req,res)=>{
  try {
    const channelId = req.body.channelId;

    // Calculate the start and end dates for the last 30 days
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30);

    // Format dates in 'YYYY-MM-DD' format
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Get channel statistics for the last 30 days
    const channelStatisticsResponse = await axios.get(
      `https://youtubeanalytics.googleapis.com/v2/reports?metrics=views,subscribersGained&start_date=${formattedStartDate}&end_date=${formattedEndDate}&ids=channel==${channelId}&key=${api_key}`
    );

    const totalViews = channelStatisticsResponse.data.rows[0][0];
    const newSubscribers = channelStatisticsResponse.data.rows[0][1];

    res.json({ totalViews, newSubscribers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
},

frequency : async(channelId)=>{
  try {
    // Fetch the channel's uploads playlist
    const playlistResponse = await youtube.channels.list({
      part: 'contentDetails',
      id: channelId,
    });

    if (playlistResponse.data.items.length === 0) {
      throw new Error('Channel not found.');
    }

    const uploadsPlaylistId = playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // Fetch the list of videos in the uploads playlist for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const playlistItemsResponse = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 50, // You can adjust this value
      publishedAfter: thirtyDaysAgo.toISOString(),
    });

    const videoCount = playlistItemsResponse.data.items.length;

    // Calculate the post frequency percentage for the last 30 days
    const today = new Date();
    const daysSinceCreation = 30; // Set to the number of days in the time frame

    const postFrequencyPercentage = ((videoCount / daysSinceCreation) * 100).toFixed(2);

    return postFrequencyPercentage;
  } catch (error) {
    console.error('Error while calculating post frequency:', error);
    throw error; // Rethrow the error for better error handling in routes
  }
},

calculateDemographicsPercentage:async(channelId)=>{
  try {
    // Fetch the channel's demographics data
    const demographicsResponse = await youtube.channels.list({
      part: 'brandingSettings',
      id: channelId,
    });

    if (demographicsResponse.data.items.length === 0) {
      throw new Error('Channel not found.');
    }

    const brandingSettings = demographicsResponse.data.items[0].brandingSettings;

    if (!brandingSettings || !brandingSettings.channel || !brandingSettings.channel.profileDemographics) {
      throw new Error('Demographics data not available for this channel.');
    }

    const demographics = brandingSettings.channel.profileDemographics;

    // Calculate the percentage of male and female subscribers
    const totalSubscribers = demographics.overall.subscriberCount;
    const malePercentage = (parseInt(demographics.gender.malePercentage) || 0);
    const femalePercentage = (parseInt(demographics.gender.femalePercentage) || 0);

    return {
      malePercentage,
      femalePercentage,
    };
  } catch (error) {
    console.error('Error while fetching demographics:', error);
    throw error; // Rethrow the error for better error handling in routes
  }
},

brandMentions:async(req,res)=>{
  const channelId = req.body.channelId;

  try {
    // Fetch the videos from the channel
    const videosResponse = await youtube.search.list({
      part: 'id',
      channelId: channelId,
      maxResults: 50, // Adjust the number of videos as needed
      order: 'date', // Order by date, or other criteria
    });

    const videoIds = videosResponse.data.items.map((video) => video.id.videoId);

    const mentionedBrands = [];

    for (const videoId of videoIds) {
      try {
        const captionsResponse = await youtube.captions.list({
          part: 'snippet',
          videoId: videoId,
        });

        const captions = captionsResponse.data.items;
        
        if (captions && captions.length > 0) {
          // Check if the first caption has the 'language' property
          if (captions[0].snippet.localized && captions[0].snippet.localized.language === 'en') {
            const captionText = captions[0].snippet.localized.description;

            // Implement brand mention extraction logic here.
            // Use regular expressions to identify brand mentions in the caption text.
            // Add the identified brands to the mentionedBrands array.
          }
        }

      } catch (captionError) {
        // Handle errors when fetching captions for a video
        console.error(`Error fetching captions for video ID ${videoId}:`, captionError);
      }
    }

    // Remove duplicate brand mentions
    const uniqueMentionedBrands = [...new Set(mentionedBrands)];

    res.json(uniqueMentionedBrands);
  } catch (error) {
    console.error('Error while fetching mentioned brands:', error);
    res.status(500).json({ error: 'An error occurred while fetching mentioned brands.' });
  }
}
}
