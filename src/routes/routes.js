const express = require("express")
const router = express.Router()
const urlController=require("../controller/urlController")


router.post("/url/shorten",urlController.createUrl)

router.get ("/:urlCode")








router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})


module.exports = router