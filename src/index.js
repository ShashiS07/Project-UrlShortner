const express = require("express");
const route = require("./routes/routes.js")
const mongoose = require("mongoose")
const app = express()

mongoose.set('strictQuery', true)
app.use(express.json())


mongoose.connect("mongodb+srv://Vinay1997:Z4AKcP40EXSsGdcj@vinay.0stv4ut.mongodb.net/group12DB?retryWrites=true&w=majority",
{useNewUrlParser:true})

.then(()=> console.log("MongoDb is connected"))
.catch (err => console.log(err))

app.use('/',route);

app.listen(process.env.PORT || 4000 ,function() {
    console.log("Express app running on port" + (process.env.PORT || 4000))
});