const urlModel=require('../Model/urlModel')
const shortId=require('shortid')

let isvalidUrl= /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/

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
    }else{
        let duplicateUrl=await urlModel.findOne({longUrl:longUrl})
        if(duplicateUrl) return res.status(400).send({status:false,message:"This longUrl already taken"})
    }
    }
    let urlCode= shortId.generate()
    if(!shortId.isValid(urlCode)) return res.status(400).send({status:false,message:"Invalid Short Url"})
    if(!urlCode) return res.status(400).send({status:false, message:"urlcode not present"})
    let url={longUrl,shortUrl:`https://localhost:3000/${urlCode}`,urlCode}
    await urlModel.create(url)
    return res.status(200).send({status:true,message:"url",data:url})
}catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

module.exports={createUrl}