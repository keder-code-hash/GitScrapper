var express = require('express');
var router = express.Router();
var needle=require('needle');

var dotenv=require("dotenv");
dotenv.config();

router.get('/user/:username', function (req, res, next) {
    url = `https://api.github.com/users/${req.params.username}`;
    repo_count = 0
    followers = []
    following = []
  
    needle('get', `https://api.github.com/users/${req.params.username}/repos`,{
        headers:{
            Authorization:process.env.AUTH_TOK
        }
    })
      .then(function (response) {
        repo_count = response.body.length;
      }).then((resp)=>{
          needle('get', `https://api.github.com/users/${req.params.username}/followers`,{
            headers:{
                Authorization:process.env.AUTH_TOK
            }
          })
          .then(function (response) {
            for (i = 0; i < response.body.length; i++) {
              followers.push({
                "user_name":response.body[i].login,
                "profile_url":response.body[i].html_url
              }); 
            }
          })
          .catch(function (error) {
            res.json({
              "status": 404,
              "message": "resource not found"
            });
          });
      }).then((resp)=>{
        needle('get', `https://api.github.com/users/${req.params.username}/following`,{
          headers:{
              Authorization:process.env.AUTH_TOK
          }
        })
        .then(function (response) {
          for (i = 0; i < response.body.length; i++) {
            following.push({
              "user_name":response.body[i].login,
              "profile_url":response.body[i].html_url
            });
          }
          // res.json(following)
        }).then((resp)=>{
          needle('get', url)
          .then(function (response) {
            res.json({
              // "body":response.body,

              "name": response.body.name,
              "avatar_url": response.body.avatar_url,
              "public_repos": repo_count, 
              "profile_url":response.body.html_url,
              "followers": followers,
              "following": following,
              "url": response.body.url,
              "bio": response.body.bio
            });
          })
          .catch(function (error) {
            res.json({
              "status": 404,
              "message": "resource not found"
            });
          });
        })
        .catch(function (error) {
          res.json({
            "status": 404,
            "message": "resource not found"
          });
        });
      })
      .catch(function (error) {
        res.json({
          "status": 404,
          "message": "resource not found"
        });
      })
  
    
  
    
  
    
  });
module.exports = router;
