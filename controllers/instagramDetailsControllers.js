const express = require('express');
const router = express.Router();
require("dotenv").config();
const influencer = require("../models/instagramDetails.models");
const axios = require("axios");


module.exports = {
  //fetching instagram basic details
  instagramData: async (req, res) => {
      
    const page= req.body.page;
    const perPage= '20';
    const q= req.body.q;
    const locations = req.body.locations;
    const genders = req.body.genders;
    const minUsersCount = req.body.minUsersCount;
    const maxUsersCount = req.body.maxUsersCount;
    const minQualityScore = req.body.minQualityScore;
    const maxQualityScore = req.body.maxQualityScore;
    const socialTypes= 'INST';
    const trackTotal= 'true';

    const options = {
      method: 'GET',
      url: 'https://instagram-statistics-api.p.rapidapi.com/search',
      params: {
        page: page,
        perPage: perPage,
        q: q,
        socialTypes: socialTypes,
        genders:genders,
        locations:locations,
        minUsersCount:minUsersCount,
        maxUsersCount:maxUsersCount,
        trackTotal:trackTotal,
        minQualityScore :minQualityScore,
        maxQualityScore :maxQualityScore,
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
          insta_id:elem.groupId,
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

    // //fetching comments data
    // instagramRapidCommentData: async (req, res) => {
    //   try {
    //     const short_code = req.body.short_code;
    //     const batch_size= 20
  
    //     const config = {
    //       headers: {
    //         "X-RapidAPI-Key": process.env.RapidKey,
    //         "X-RapidAPI-Host": process.env.RapidHost,
    //       },
    //     };
    //     const userData = axios
    //       .get(
    //         `https://instagram28.p.rapidapi.com/media_comments?short_code=${short_code}&batch_size=${batch_size}`,
    //         config
    //       )
    //       .then((userData) => {
    //         res.status(201).send([{
    //           comment_count:userData.data.data.shortcode_media.edge_media_to_parent_comment.count,
    //           comments : userData.data.data.shortcode_media.edge_media_to_parent_comment.edges
    //         }]);
    //       })
    //       .catch((error) => {
    //         res.send(error);
    //       });
    //   } catch (error) {
    //     res.status(404).send(error);
    //   }
    // },

    //hashtag
    Hashtag:async(req,res)=>{
      try {
        const hashtag = req.body.hashtag;
  
        const config = {
          headers: {
            "X-RapidAPI-Key": process.env.Insta_RapidKey,
            "X-RapidAPI-Host": process.env.Insta_RapidHost,
          },
        };
        const userData = axios
          .get(
            `https://instagram28.p.rapidapi.com/hash_tag_medias/?hash_tag=${hashtag}`,
            config
          )
          .then((userData) => {
            const data=[];
            userData.data.data.hashtag.edge_hashtag_to_media.edges.map((elem)=>{
              data.push({
                edges:elem.node
              })
            });
            res.status(201).send([{
              hashtag_id:userData.data.data.hashtag.id,
              hashtag_name:userData.data.data.hashtag.name,
              count:userData.data.data.hashtag.edge_hashtag_to_media.count,
              node:data,
            }]);
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
          url: `https://www.instagram.com/${name}`
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
    }
};
