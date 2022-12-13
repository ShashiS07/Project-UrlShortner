const urlModel=require('../Model/urlModel')
const shortId=require('shortid')

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
    }else{
        let alreadypresent=await urlModel.findOne({longUrl:longUrl})
        if(alreadypresent){
           var urlCode=alreadypresent.urlCode
        }else{
            var urlCode= shortId.generate()
        }
    }
}
    if(!shortId.isValid(urlCode)) return res.status(400).send({status:false,message:"Invalid Short Url"})
    if(!urlCode) return res.status(400).send({status:false, message:"urlcode not present"})
    let url={longUrl,shortUrl:`https://localhost:3000/${urlCode.toLowerCase()}`,urlCode}
    await urlModel.create(url)
    return res.status(200).send({status:true,message:"url",data:url})
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

    let findurl=await urlModel.findOne({urlCode})
    if(!findurl) return res.status(400).send({status:false,message:"Url is not found"})   
    
    let data=findurl.longUrl
    return res.status(302).redirect(data)
}catch(error){
    return res.status(500).send({status:false})
}
}
module.exports={createUrl,geturl}