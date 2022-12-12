const express = require("express")
const router = express.Router()



router.post("/url/shorten")

router.get ("/:urlCode")








router.all("/*",function(req,res){
    res.status(404).send({msg:"invalid http request"})
})


module.exports = router