var express = require('express');
var router = express.Router();
var needle=require('needle');

var dotenv=require("dotenv");
dotenv.config();

router.get('/commits/:dates/:repo',(req,res,next)=>{
    var dates=req.params.dates;
    var repo=req.params.repo;
    
    var dateArr=dates.split(",");
    
    var endPoint=`https://api.github.com/search/commits?q=repo:${repo} author-date:${dateArr[0]}..${dateArr[1]}`

    needle('get',endPoint,{
        headers:{
            Authorization:process.env.AUTH_TOK
        }
    }).then((resp)=>{
        if(resp.statusCode!==200){
            if(resp.statusCode===404){
                res.status(404).send({"status": 404,
                "message": "resource not found"})
            }
        }
        else{
            if(resp.body!==null){

                var commits=[]
                if(resp.body.items.length===0){
                    res.status(404).send(
                        {
                            "status": 404,
                            "message": "resource not found"
                        }
                    )
                }
                for(var i=0;i<resp.body.items.length;i++){
                    commits.push({
                        node_id:resp.body.items[i].node_id,
                        message: resp.body.items[i].commit.message,
                        commiter_name:resp.body.items[i].commit.committer.name,
                        commit_url:resp.body.items[i].html_url,
                        date: resp.body.items[i].commit.author.date,
                    });
                }
                let Commits={
                    "count":resp.body.total_count,
                    "commits":commits
                }
                res.status(200).send(Commits);
                // res.send(resp.body);
            }
            else{
                res.statusCode=400;
                res.send({"status": 400,
                "message": "Bad Request."+err});
            }
            
        }
    }).catch(function(err) {
        res.statusCode=400;
        res.send({"status": 400,
        "message": "Bad Request."+err});
        next(err);
        });
})

module.exports = router;
