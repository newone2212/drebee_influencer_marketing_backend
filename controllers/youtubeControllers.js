const express = require('express');
const router = express.Router();
require("dotenv").config();
const axios = require("axios");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // Cache for 24 hours (in seconds)



module.exports = {
  //search video
  searchVideo: async (req, res) => {
    // try {
    // const id=req.body.id
    // const channel_id=req.body.channel_id
    // const api_key=process.env.api_key
    // const options = axios.get(
    //   `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${[api_key]}`
    // ).then((result)=>{
    //   const channelOptions = axios.get(
    //     `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channel_id}&key=${[api_key]}]`
    //   )
    //   .then((res)=>{
    //     res.send({
    //       video:result.data,
    //       // channel:res.data
    //     }
    //     )
    //   }).catch((err)=>{
    //     res.send(err)
    //   })
    //   .catch((error)=>{
    //     res.send(error)
    //   })
    // })

    try {
      const id=req.body.id
      const channel_id=req.body.channel_id
      const api_key=process.env.api_key
  
      // Get video data from Google v3 API
      const videoDetails = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${[api_key]}`
      );
  
      // Extract video details from the response
      const video = videoDetails.data.items
      // console.log(video)
  
      // Get a relevant channel Details
      const channelDetails = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channel_id}&key=${[api_key]}`
      )
  
      const channel = channelDetails.data.items
      // console.log(channel)

      // const promotion=await axios.get(
      //   `https://technicaltricks.xyz/yt.php?v=4${id}`
      // )
      // const paidpromtion=promotion.data
  
      // Prepare the response
      const response = {
        // paidpromtion:paidpromtion,
        video_details: video,
        channel_details: channel,
      };
  
      res.json(response);
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }

    
    //   const response = await axios.request(options);
    //   try{
    //   const ress = await axios.request(channelOptions);
    //   res.send({
    //     video:response.data.items,
    //     channel:ress.data.items
    //   });
    // }
    // catch (err){
    //   res.send(err);
    // }
    // } catch (errorrrr) {
    //   res.send(errorrrr);
    // }
    // try {
    //   const keyword = req.body.keyword;
    //   // const channelId = req.body.channelId;

    //   const config = {
    //     headers: {
    //       "X-RapidAPI-Key": process.env.RapidKey,
    //       "X-RapidAPI-Host": process.env.RapidHost,
    //     },
    //   };
    //   const videoData = axios
    //     .get(
    //       `https://youtube-media-downloader.p.rapidapi.com/v2/search/videos?keyword=${keyword}`,
    //       config
    //     )
    //         .then((videoData)=>{
    //           // console.log(commentData.data)
    //           const data=[];
    //           videoData.data.items.map((elem)=>{
    //             data.push({
    //               video_id:elem.id,
    //               video_title:elem.title,
    //               video_description:elem.description,
    //               view_counts:elem.viewCountText,
    //               publish_time:elem.publishedTimeText,
    //               video_thumbnail:elem.thumbnails[0].url,
    //               channel_id:elem.channel.id
    //               //channel details(profile photo, subscribers, name)
    //               //tags
    //               //likes
    //               //comments
    //               //video redirect link
    //             })
    //           });
    //           res.status(201).send({
    //             data:data
    //         })

    //       })
    //     .catch((error) => {
    //       res.send(error);
    //     });
    // } catch (error) {
    //   res.status(404).send(error);
    // }
  },

  videDetails:async(req,res)=>{
    const id=req.body.id
    const api_key=process.env.api_key
    const options = {
      method: 'GET',
      url: `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${[api_key]}`
    };
    
    try {
      const response = await axios.request(options);
      res.send(response.data.items);
    } catch (error) {
      res.send(error);
    }
  },

  //join date and avatar
  // getJoinDateNdAvatar:async(req,res)=>{
  //   try {
  //     const channelId = req.body.channelId;
  //     const config = {
  //       headers: {
  //         "X-RapidAPI-Key": process.env.RapidKey,
  //         "X-RapidAPI-Host": process.env.RapidHost,
  //       }
  //     };
  //     const userData = axios
  //       .get(
  //         `https://youtube-media-downloader.p.rapidapi.com/v2/channel/details?channelId=${channelId}`,
  //         config
  //       )
  //       .then((userData) => {
  //         res.status(201).send({
  //           joinedDateText:userData.data.joinedDateText,
  //           avatar:userData.data.avatar[0].url,

  //       });
  //       })
  //       .catch((error) => {
  //         res.send(error);
  //       });
  //   } catch (error) {
  //     res.status(404).send(error);
  //   }
  // },

  // video-id
  videoId:async(req,res)=>{
    // try {
    //   const keyword = req.body.keyword;
    //   const config = {
    //     headers: {
    //       "X-RapidAPI-Key": process.env.RapidKey,
    //       "X-RapidAPI-Host": process.env.RapidHost,
    //     }
    //   };
    //   const userData = axios
    //     .get(
    //       `https://youtube-media-downloader.p.rapidapi.com/v2/search/videos?keyword=${keyword}`,
    //       config
    //     )
    //     .then((userData) => {
    //       const data=[];
    //       userData.data.items.map((elem)=>{
    //         data.push({
    //           id:elem.id,
    //           channel_id:elem.channel.id
    //         })
    //       });
    //       res.status(201).send({
    //         data:data
    //     });
    //     })
    //     .catch((error) => {
    //       res.send(error);
    //     });
    // } catch (error) {
    //   res.status(404).send(error);
    // }
    const  keyword=req.body.keyword;
    const  duration=req.body.duration;
    const  advertisement=req.body.advertisement;
    const category=req.body.category;
    const countryCode=req.body.countryCode;
    const type=req.body.type;
    const publishDateFilter=req.body.publishDateFilter;
    const minViews= req.body.minViews; // Minimum views
    const maxViews= req.body.maxViews;   // Maximum views

    const API_KEY=process.env.api_key;

      // Calculate the publish date range based on the specified filter.
const now = new Date();
let publishedAfter = null;

if (publishDateFilter === 'Last 24 hours') {
  publishedAfter = new Date(now - 24 * 60 * 60 * 1000).toISOString();
} else if (publishDateFilter === 'Past 7 days') {
  publishedAfter = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
} else if (publishDateFilter === 'Past 15 days') {
  publishedAfter = new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString();
} else if (publishDateFilter === 'Past 30 days') {
  publishedAfter = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
}
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: API_KEY,
          q: keyword,
          part: 'snippet',
          maxResults: 50, // Adjust the number of results as needed.
          type: 'video', // Filter by type: 'video', 'channel', 'playlist', etc.
          // order: 'viewCount', // Filter by views.
          videoDuration: duration, // Filter by duration: 'any', 'short', 'medium', 'long'.
          videoCaption: 'any', // Filter by caption: 'any', 'closedCaption', 'none'.
          videoLicense: 'any', // Filter by license: 'any', 'creativeCommon', 'youtube'.
          videoPaidPromotion: advertisement, // Filter by paid promotion videos: 'any', 'true', 'false'.
          videoCategoryId: category, // Filter by category ID, e.g., '22' for gaming.
          regionCode: countryCode, // Filter by country.
          eventType:type, // Filter by event type: 'completed', 'live', 'upcoming'.
          publishedAfter,
          minViews,  // Minimum views
          maxViews,  // Maximum views
  
          // relevanceLanguage: 'en', // Language code for relevance.
        },
      });
      const data=[];

      response.data.items.map((elem)=>{
        data.push({
          id:elem.id.videoId,
          channel_id:elem.snippet.channelId,
        })
      })
  
      res.status(200).json({
        data:data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  //search video
  searchChannel: async (req, res) => {
      
    const page= req.body.page;
    const perPage= '20';
    const q= req.body.q;
    const tags = req.body.tags;
    const locations = req.body.locations;
    const genders = req.body.genders;
    const minER = req.body.minER;
    const maxER = req.body.maxER;
    const minUsersCount = req.body.minUsersCount;
    const maxUsersCount = req.body.maxUsersCount;
    const minViews = req.body.minViews;
    const maxViews = req.body.maxViews;
    const minLikes = req.body.minLikes;
    const maxLikes = req.body.maxLikes;
    const minComments = req.body.minComments;
    const maxComments = req.body.maxComments;
    const minQualityScore = req.body.minQualityScore;
    const maxQualityScore = req.body.maxQualityScore;
    const socialTypes= 'YT';
    const trackTotal= 'true';
    const videoPaidProductPlacement = 'true'

    const options = {
      method: 'GET',
      url: 'https://instagram-statistics-api.p.rapidapi.com/search',
      params: {
        page: page,
        perPage: perPage,
        q: q,
        socialTypes: socialTypes,
        tags:tags,
        locations:locations,
        genders:genders,
        minER:minER,
        maxER:maxER,
        minUsersCount:minUsersCount,
        maxUsersCount:maxUsersCount,
        minViews:minViews,
        maxViews:maxViews,
        minLikes:minLikes,
        maxLikes:maxLikes,
        minComments:minComments,
        maxComments:maxComments,
        trackTotal:trackTotal,
        minQualityScore:minQualityScore,
        maxQualityScore:maxQualityScore,
        videoPaidProductPlacement:videoPaidProductPlacement
      },
      headers: {
        'X-RapidAPI-Key': process.env.Stat_RapidKey,
        'X-RapidAPI-Host': process.env.Stat_RapidHost
      }
    };
    
    try {
      const response = await axios.request(options);
      const data=[];
      response.data.data.map((elem)=>{
        data.push({
          channel_id:elem.groupID,
          socialType:elem.socialType,
          name:elem.name,
          image:elem.image,
          description:elem.description,
          url:elem.url,
          user_count:elem.usersCount,
          tags:elem.tags,
          suggested_tags:elem.suggestedTags,
          average_ER:elem.avgER,
          average_likes:elem.avgLikes,
          average_comments:elem.avgComments,
          average_views:elem.avgViews,
          average_video_likes:elem.avgVideoLikes,
          average_video_comments:elem.avgVideoComments,
          average_video_views:elem.avgVideoViews,
          country:elem.country,
          countryCode:elem.countryCode,
          language:elem.language,
          gender:elem.gender,
          last_3_post:elem.lastPosts,
          fake_followers_count:elem.pctFakeFollowers,
          audience_gender:elem.genders,
          audience_ages:elem.ages,
          quality_score:elem.qualityScore
        })
      });
      res.status(201).send({
        total_result:response.data.pagination.total,
        total_pages:response.data.pagination.totalPages,
        data:data
        });
    } catch (error) {
      res.send(error);
    }
  },

  //getting video on the basis of VideoID
  // videoOnBasisOfId: async (req, res) => {
  //   try {
  //     const videoId = req.body.videoId;

  //     const config = {
  //       headers: {
  //         "X-RapidAPI-Key": process.env.RapidKey,
  //         "X-RapidAPI-Host": process.env.RapidHost,
  //       },
  //     };
  //     const userData = axios
  //       .get(
  //         `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`,
  //         config
  //       )
  //       .then((userData) => {
  //         res.status(201).send({
  //           video:userData.data.videos.items
  //         });
  //       })
  //       .catch((error) => {
  //         res.send(error);
  //       });
  //   } catch (error) {
  //     res.status(404).send(error);
  //   }
  // },


  //getting channels on the basis of ChannelID
  // channelOnBasisOfId: async (req, res) => {
  //   try {
  //     const channelId = req.body.channelId;

  //     const config = {
  //       headers: {
  //         "X-RapidAPI-Key": process.env.Stat_RapidKey,
  //         "X-RapidAPI-Host": process.env._Stat_RapidHost,
  //       },
  //     };
  //     const userData = axios
  //       .get(
  //         `https://instagram-statistics-api.p.rapidapi.com/community?cid=YT:${channelId}`,
  //         config
  //       )
  //       .then((userData) => {
  //         res.status(201).send({
  //           screen_name:userData.data.data.screenName
  //         });
  //       })
  //       .catch((error) => {
  //         res.send(error);
  //       });
  //   } catch (error) {
  //     res.status(404).send(error);
  //   }
  // },

  // channelId:async(req,res)=>{
  //   try {
  //     const keyword = req.body.keyword;

  //     const config = {
  //       headers: {
  //         "X-RapidAPI-Key": process.env.RapidKey,
  //         "X-RapidAPI-Host": process.env.RapidHost,
  //       },
  //     };
  //     const userData = axios
  //       .get(
  //         `https://youtube-media-downloader.p.rapidapi.com/v2/search/channels?keyword=${keyword}`,
  //         config
  //       )
  //       .then((userData) => {
  //         const data=[];

  //         userData.data.items.map((elem)=>{
  //           // console.log(elem.id)
  //           data.push({
  //             "id":elem.id
  //           })
  //         });
  //         // console.log(mandirdata)
  //         res.status(201).send({
  //           data:data
  //       });
  //       })
  //       .catch((error) => {
  //         res.send(error);
  //       });
  //   } catch (error) {
  //     res.status(404).send(error);
  //   }
  // },

  detailsOnTheBasisOfChannelId:async(req,res)=>{
    const channelId=req.body.channelId;
    const options = {
      method: 'GET',
      url: 'https://instagram-statistics-api.p.rapidapi.com/community',
      params: {
        cid: `YT:${channelId}`
      },
      headers: {
        'X-RapidAPI-Key': '2791b70759msh8972b51f24446a0p10a2c1jsn73e19458a0b1',
        'X-RapidAPI-Host': 'instagram-statistics-api.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      res.send({
        channel_name:response.data.data.name,
        screen_name:response.data.data.screenName,
        url:response.data.data.url,
        user_count:response.data.data.usersCount,
        tags:response.data.data.tags,
        image:response.data.data.image
      });
    } catch (error) {
      res.send(error);
    }
  },

  //auto suggest
  autoSuggest:async(req,res)=>{
    try {
      const keyword = req.body.keyword;

      const config = {
        headers: {
          "X-RapidAPI-Key": process.env.RapidKey,
          "X-RapidAPI-Host": process.env.RapidHost,
        },
      };
      const userData = axios
        .get(
          `https://youtube-media-downloader.p.rapidapi.com/v2/search/suggestions?keyword=${keyword}`,
          config
        )
        .then((userData) => {
          res.status(201).send({
            video:userData.data
          });
        })
        .catch((error) => {
          res.send(error);
        });
    } catch (error) {
      res.status(404).send(error);
    }
  },

  //count on the basis of hashtag
  Hashtag: async (hashtag) => {
    const API_KEY = process.env.api_key
    const videoList = [];
    let nextPageToken = null;
  
    while (true) {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: API_KEY,
          part: 'snippet',
          q: `#${hashtag}`,
          maxResults: 50, // Adjust as needed
          pageToken: nextPageToken, // Include the page token
        },
      });
  
      videoList.push(...response.data.items);
      nextPageToken = response.data.nextPageToken;
  
      if (!nextPageToken) {
        break;
      }
    }
  
    const videoCount = videoList.length;
  
    return { videoList, videoCount };

  },

    //get the comment count of a particular video
    // commentOnBasisOfId: async (req, res) => {
    //   try {
    //     const videoId = req.body.videoId;
  
    //     const config = {
    //       headers: {
    //         "X-RapidAPI-Key": process.env.RapidKey,
    //         "X-RapidAPI-Host": process.env.RapidHost,
    //       },
    //     };
    //     const userData = axios
    //       .get(
    //         `https://youtube-media-downloader.p.rapidapi.com/v2/video/comments?videoId=${videoId}`,
    //         config
    //       )
    //       .then((userData) => {
    //         res.status(201).send({
    //           count:userData.data.countText
    //         });
    //       })
    //       .catch((error) => {
    //         res.send(error);
    //       });
    //   } catch (error) {
    //     res.status(404).send(error);
    //   }
    // },

    //activity graph of a particular user
    activity:async(req,res)=>{
      try {
        const channelId = req.body.channelId;
  
        const config = {
          headers: {
            "X-RapidAPI-Key": process.env.Stat_RapidKey,
            "X-RapidAPI-Host": process.env.Stat_RapidHost,
          },
        };
        const userData = axios
          .get(
            `https://instagram-statistics-api.p.rapidapi.com/statistics/activity?cid=YT:${channelId}`,
            config
          )
          .then((userData) => {
            res.status(201).send({
              data:userData.data.data
            });
          })
          .catch((error) => {
            res.send(error);
          });
      } catch (error) {
        res.status(404).send(error);
      }
    },

    //retrospective
    retrospective:async(req,res)=>{
      try {
        const channelId = req.body.channelId;
        const from = req.body.from;
        const to = req.body.to;
  
        const config = {
          headers: {
            "X-RapidAPI-Key": process.env.Stat_RapidKey,
            "X-RapidAPI-Host": process.env.Stat_RapidHost,
          },
        };
        const userData = axios
          .get(
            `https://instagram-statistics-api.p.rapidapi.com/statistics/retrospective?cid=YT:${channelId}&from=${from}&to=${to}`,
            config
          )
          .then((userData) => {
            res.status(201).send({
              data:userData.data.data
            });
          })
          .catch((error) => {
            res.send(error);
          });
      } catch (error) {
        res.status(404).send(error);
      }
    },


    //posts
    posts:async(req,res)=>{
      try {
        const channelId = req.body.channelId;
        const from = req.body.from;
        const to = req.body.to;
  
        const config = {
          headers: {
            "X-RapidAPI-Key": process.env.Stat_RapidKey,
            "X-RapidAPI-Host": process.env.Stat_RapidHost,
          },
        };
        const userData = axios
          .get(
            `https://instagram-statistics-api.p.rapidapi.com/posts?cid=YT:${channelId}&from=${from}&to=${to}`,
            config
          )
          .then((userData) => {
            res.status(201).send({
              data:userData.data.data
            });
          })
          .catch((error) => {
            res.send(error);
          });
      } catch (error) {
        res.status(404).send(error);
      }
    },

    channelProfile:async(req,res)=>{
      const name=req.body.name
      const options = {
        method: 'GET',
        url: 'https://instagram-statistics-api.p.rapidapi.com/community',
        params: {
          url: `https://www.youtube.com/@${name}`
        },
        headers: {
          'X-RapidAPI-Key': process.env.Stat_RapidKey,
          'X-RapidAPI-Host': process.env.Stat_RapidHost
        }
      };
      
      try {
        const response = await axios.request(options);
        res.send(response.data.data);
      } catch (error) {
        res.send(error);
      }
    },


    videoFilter:async(req,res)=>{
      // const  keyword  = req.body.keyword;
      // const  duration  = req.body.duration;
      // const  viewCount  = req.body.viewCount;
      // const  advertisement  = req.body.advertisement;
      // const category=req.body.category;
      // const countryCode=req.body.countryCode;
      // const type=req.body.type;
      // const publishDateFilter=req.body.publishDateFilter;
      const API_KEY=process.env.api_key;

        // Calculate the publish date range based on the specified filter.
  // const now = new Date();
  // let publishedAfter = null;
  
  // if (publishDateFilter === 'last24hours') {
  //   publishedAfter = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  // } else if (publishDateFilter === 'past7days') {
  //   publishedAfter = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  // } else if (publishDateFilter === 'past15days') {
  //   publishedAfter = new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString();
  // } else if (publishDateFilter === 'past30days') {
  //   publishedAfter = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
  // }
  //     try {
  //       const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
  //         params: {
  //           key: API_KEY,
  //           q: keyword,
  //           part: 'snippet',
  //           maxResults: 20, // Adjust the number of results as needed.
  //           type: 'video', // Filter by type: 'video', 'channel', 'playlist', etc.
  //           order: viewCount, // Filter by views.
  //           videoDuration: duration, // Filter by duration: 'any', 'short', 'medium', 'long'.
  //           videoCaption: 'any', // Filter by caption: 'any', 'closedCaption', 'none'.
  //           videoLicense: 'any', // Filter by license: 'any', 'creativeCommon', 'youtube'.
  //           videoPaidPromotion: advertisement, // Filter by paid promotion videos: 'any', 'true', 'false'.
  //           videoCategoryId: category, // Filter by category ID, e.g., '22' for gaming.
  //           regionCode: countryCode, // Filter by country.
  //           eventType:type, // Filter by event type: 'completed', 'live', 'upcoming'.
  //           publishedAfter
  //           // relevanceLanguage: 'en', // Language code for relevance.
  //         },
  //       });
  //       const data=[];

  //       response.data.items.map((elem)=>{
  //         data.push({
  //           id:elem.id.videoId,
  //           channel_id:elem.snippet.channelId,
  //         })
  //       })
    
  //       res.status(200).json({
  //         data:data
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).json({ error: 'Internal Server Error' });
  //     }
  const {
    keyword,
    subscribersMin,
    subscribersMax,
    totalViewsMin,
    totalViewsMax,
    views7Days,
    views15Days,
    views30Days,
    superChat,
    publishDateFilter,
    weeklyUpdate,
    liveViewers,
    category,
    country,
  } = req.body;

  
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: API_KEY,
        q: keyword,
        part: 'snippet',
        type: 'channel',
        maxResults: 50, // Adjust the number of results as needed.
        relevanceLanguage: 'en', // Language code for relevance.
        regionCode: country, // Filter by country.
      },
    });

    // Filter channels based on various criteria
    const filteredChannels = response.data.items.filter((channel) => {
      // Implement your filtering logic here based on the query parameters.
      const now = new Date();
    let publishedAfter = null;
    
    if (publishDateFilter === 'Last 24 hours') {
      publishedAfter = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    } else if (publishDateFilter === 'Past 7 days') {
      publishedAfter = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (publishDateFilter === 'Past 15 days') {
      publishedAfter = new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString();
    } else if (publishDateFilter === 'Past 30 days') {
      publishedAfter = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
      return (
        // Subscribers range filter
        channel.statistics.subscriberCount >= subscribersMin &&
        channel.statistics.subscriberCount <= subscribersMax &&
        // Total views filter
        viewCount >= totalViewsMin &&
        viewCount <= totalViewsMax &&
        // Views within specific time frames
        channel.statistics.viewCount >= views7Days &&
        channel.statistics.viewCount >= views15Days &&
        channel.statistics.viewCount >= views30Days &&
        
        
        viewsLast30Days >= days30 &&
        viewCount >= days15 &&
        viewCount >= days7 &&
        // Super chat filter
        superChatRevenue >= superChat&& // Add the logic to check super chat
        // Publish date filter
        publishedAfter
        // Weekly update filter
        // Live viewers filter
        // Category filter
        // Country filter
        // Add more filters as needed.
        
      );
    });

    res.json(filteredChannels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
    },

    categoryId:async(req,res)=>{
      const API_KEY=process.env.api_key;
      const cacheKey = 'youtubeCategories';

      // Check if the data is in the cache
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        return res.json(cachedData);
      }
    
      try {
        // Fetch categories from YouTube Data API
        const response = await axios.get('https://www.googleapis.com/youtube/v3/videoCategories', {
          params: {
            key: API_KEY,
            part: 'snippet',
            regionCode: 'US', // Replace with the desired region code
          },
        });
    
        const categories = response.data.items.map(item => ({
          id: item.id,
          title: item.snippet.title,
        }));
    
        // Cache the data
        cache.set(cacheKey, categories);
    
        res.json(categories);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    
    },

    countryCode:async(req,res)=>{
      const API_KEY=process.env.api_key;
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/i18nRegions', {
          params: {
            key: API_KEY,
            part: 'snippet',
          },
        });
    
        const countries = response.data.items.map((item) => ({
          code: item.id,
          name: item.snippet.name,
        }));
        const  filter  = req.body.filter;

        if (filter) {
          const filteredCountries = countries.filter(country =>
            country.name.toLowerCase().includes(filter.toLowerCase())
          );
          res.json(filteredCountries);
        } else {
          res.json(countries);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
};
