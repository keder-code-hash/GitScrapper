var express = require('express');
var router = express.Router();
var needle=require('needle');

var dotenv=require("dotenv");
dotenv.config();


router.get('/repo/:stars',(req,res,next)=>{
    
    var stars=req.params.stars;
    
    var starArr=stars.split(",");
    
    var endPoint=`https://api.github.com/search/repositories?q=stars:${starArr[0]}..${starArr[1]}`

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

                var repos=[]
                if(resp.body.items.length===0){
                    res.status(404).send(
                        {
                            "status": 404,
                            "message": "resource not found"
                        }
                    )
                }
                for(var i=0;i<resp.body.items.length;i++){
                    repos.push({
                        
                            name: resp.body.items[i].name,
                            creation_date:resp.body.items[i].created_at,
                            stars: resp.body.items[i].created_at,
                            size: resp.body.items[i].size,
                            forks: resp.body.items[i].forks_count,
                            owner_name:resp.body.items[i].owner.login
                            
                    });
                }
                res.status(200).send(repos);
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
