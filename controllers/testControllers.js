const { google } = require('googleapis');
const axios = require('axios');

const apiKey = process.env.api_key; // Replace with your API key

// Initialize the YouTube Data API client
const youtube = google.youtube({
  version: 'v3',
  auth: apiKey,
});

async function getChannelStatistics(channelId) {
  try {
    // Get channel details
    const channelResponse = await youtube.channels.list({
      part: 'statistics,snippet',
      id: channelId,
    });

    const channelData = channelResponse.data.items[0];
    const statistics = channelData.statistics;
    const snippet = channelData.snippet;

    const subscribers = statistics.subscriberCount;
    const totalVideos = statistics.videoCount;
    const title = snippet.title;

    // Get the paid partnership data for the channel
    const paidPartnershipEngagement = await getPaidPartnershipEngagement(channelId);

    return {
      title,
      subscribers,
      totalVideos,
      avgLikes: paidPartnershipEngagement.avgLikes,
      avgComments: paidPartnershipEngagement.avgComments,
      avgViews: paidPartnershipEngagement.avgViews,
    };
  } catch (error) {
    console.error('Error retrieving channel data:', error);
    return null;
  }
}

async function getPaidPartnershipEngagement(channelId) {
    try {
      // Fetch video data for the channel's paid partnership videos
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet&order=date&type=video&videoDefinition=any&videoType=any&eventType=completed`
      );
  
      const videos = response.data.items;
  
      if (!videos.length) {
        console.log('No paid partnership videos found.');
        return {
          avgLikes: 0,
          avgComments: 0,
          avgViews: 0,
        };
      }
  
      // Calculate the average likes, comments, and views
      let totalLikes = 0;
      let totalComments = 0;
      let totalViews = 0;
      let validVideoCount = 0; // Count of videos with valid statistics
  
      videos.forEach((video) => {
        if (video.statistics && video.statistics.likeCount) {
          totalLikes += video.statistics.likeCount;
          totalComments += video.statistics.commentCount;
          totalViews += video.statistics.viewCount;
          validVideoCount++;
        }
      });
  
      if (validVideoCount === 0) {
        // console.log('No valid statistics found in paid partnership videos.');
        return {
          avgLikes: 0,
          avgComments: 0,
          avgViews: 0,
          message:'No valid statistics found in paid partnership videos.'
        };
      }
  
      const avgLikes = totalLikes / validVideoCount;
      const avgComments = totalComments / validVideoCount;
      const avgViews = totalViews / validVideoCount;
  
      return {
        avgLikes,
        avgComments,
        avgViews,
      };
    } catch (error) {
      console.error('Error retrieving paid partnership data:', error);
      return {
        avgLikes: 0,
        avgComments: 0,
        avgViews: 0,
      };
    }
  }


  async function fetchChannelStatistics(channelId) {
    const response = await youtube.channels.list({
      part: 'statistics',
      id: channelId,
    });
  
    const { viewCount, subscriberCount } = response.data.items[0].statistics;
  
    return { viewCount, subscriberCount };
  }
  
  async function fetchDailyData(channelId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);
  
    const currentDate = new Date(thirtyDaysAgo);
  
    const dailyStats = [];
  
    let prevViews = null;
    let prevSubscribers = null;
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 1);
  
      const response = await youtube.search.list({
        part: 'snippet',
        channelId,
        maxResults: 1,
        publishedAfter: date.toISOString(),
        publishedBefore: nextDate.toISOString(),
      });
  
      const viewsCount = response.data.pageInfo.totalResults;
  
      const subscribersResponse = await youtube.channels.list({
        part: 'statistics',
        id: channelId,
      });
  
      const subscribersCount = subscribersResponse.data.items[0].statistics.subscriberCount;
  
      // Calculate the daily growth, ensuring it's not negative
      const viewsGrowth = prevViews !== null ? Math.max(viewsCount - prevViews, 0) : 0;
      const subscribersGrowth = prevSubscribers !== null ? subscribersCount - prevSubscribers : 0;
  
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        viewsGrowth,
        subscribersGrowth,
      });
  
      prevViews = viewsCount;
      prevSubscribers = subscribersCount;
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dailyStats;
  }

// controllers/brandMentionsController.js
// ...

async function findBrandsMentionedInChannel(targetChannelId) {
    const mentionedBrands = new Set();
  
    try {
      // Search for videos from the target channel
      const videoResponse = await youtube.search.list({
        part: 'snippet',
        channelId: targetChannelId,
        maxResults: 50, // You can adjust this value
      });
  
      console.log('Found videos:', videoResponse.data.items);
  
      for (const video of videoResponse.data.items) {
        const videoTitle = video.snippet.title;
        const videoDescription = video.snippet.description;
  
        // Extract brand mentions from video titles and descriptions
        // You can use regex or other methods to find brand mentions
  
        // For example, using a simple regex pattern:
        const brandMentions = videoTitle.match(/(brand1|brand2|brand3)/gi);
  
        if (brandMentions) {
          brandMentions.forEach((brand) => mentionedBrands.add(brand.toLowerCase()));
        }
  
        const commentResponse = await youtube.commentThreads.list({
          part: 'snippet',
          videoId: video.id.videoId,
          maxResults: 50, // You can adjust this value
        });
  
        console.log('Found comments:', commentResponse.data.items);
  
        for (const commentThread of commentResponse.data.items) {
          const comment = commentThread.snippet.topLevelComment;
          const commentText = comment.snippet.textDisplay;
  
          // Extract brand mentions from comments
          // You can use regex or other methods to find brand mentions
  
          // For example, using a simple regex pattern:
          const commentBrandMentions = commentText.match(/(brand1|brand2|brand3)/gi);
  
          if (commentBrandMentions) {
            commentBrandMentions.forEach((brand) => mentionedBrands.add(brand.toLowerCase()));
          }
        }
      }
    } catch (error) {
      console.error('Error while fetching brand mentions:', error);
      throw error; // Rethrow the error for better error handling in routes
    }
  
    console.log('Mentioned brands:', Array.from(mentionedBrands));
  
    return Array.from(mentionedBrands);
  }
  
  // ...
  
  
  

module.exports = {
  getChannelStatistics,
  fetchChannelStatistics,
  fetchDailyData,
  findBrandsMentionedInChannel
};
