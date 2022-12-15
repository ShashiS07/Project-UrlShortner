const urlModel=require('../Model/urlModel')
const shortId=require('shortid')
const axios  = require("axios")
const redis = require("redis");
const { promisify } = require("util");


const redisClient = redis.createClient(
    10797,
    "redis-10797.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("sT6NJhwSeQrEj3Gap9OhzuMuTmxoHoja", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });
  
  //2. Prepare the functions for each command
  
  const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
  const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

// ============================regex for validate link========================================

let isvalidUrl= /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/

// ===================================create short Url========================================

const createUrl=async function(req,res){
try{
    let data= req.body
    if(!Object.keys(data).length){
        return res.status(400).send({status:false, message:"Please provide longUrl"})
    }
    let {longUrl}=data
    if(longUrl){
        if(!isvalidUrl.test(longUrl)){
        return res.status(400).send({status:false,message:"Please Provide Valid Url"})
    }

    let urlfound = false
    await axios.get(longUrl)
    .then((res)=>{if(res.status==200 ||res.status==201) urlfound = true})
    .catch(()=>{})

    if (urlfound == false){
        return res.status(400).send({status : false , message : "invalid URL"})
    }

    let urlCode=shortId.generate().toLowerCase()
    let checkincache=await GET_ASYNC(`${longUrl}`)
    if(checkincache){
        let urlData=JSON.parse(checkincache)

        return res.status(201).send({status:true, message:"URL is already shortened",data:urlData})
    }
    let urlpresent= await urlModel.findOne({longUrl}).select({ createdAt: 0, updatedAt: 0, __v: 0, _id: 0 })
    if(urlpresent){
        await SET_ASYNC(`${longUrl}`,JSON.stringify(urlpresent),"EX",300);

        return res.status(201).send({status:true, message:"URL is already shortened",data:urlpresent})
    }
    let baseUrl="https://localhost:3000/"
    let shortUrl=`${baseUrl}${urlCode}`
    let url={longUrl,shortUrl,urlCode}

    await urlModel.create(url)
    return res.status(201).send({status:true,message:"short url created successfully", data:url})
}
}catch(error){
       return res.status(500).send({status:false,message:error.message})
}
}

// ===================================get redirect url===============================

const geturl=async function(req,res){
try{
    let urlCode=req.params.urlCode
    if(urlCode==":urlCode") return res.status(400).send({status:false, message:"Please Provide Value"})

    if(!shortId.isValid(urlCode)) return res.status(400).send({status:false,message:"Invalid url"})

    let cacheurldata=await GET_ASYNC(`${urlCode}`);
    if(cacheurldata){
    let urlData=JSON.parse(cacheurldata)
    return res.status(302).redirect(urlData.longUrl)
    }
    let findurl=await urlModel.findOne({urlCode})
    if(!findurl){
        return res.status(404).send({status:false,message:"Url is not found"}) 
    }else{
        await SET_ASYNC(`${urlCode}`,JSON.stringify(findurl),"EX",300)
        return res.status(302).redirect(findurl.longUrl)
    }  
    
}catch(error){
    return res.status(500).send({status:false,error:error.message})
}
}
module.exports={createUrl,geturl}