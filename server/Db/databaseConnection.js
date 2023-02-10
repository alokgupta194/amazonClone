import mongoose from "mongoose"

import config from "../config/index.js"
import data from "../constant/product.js"

const connectionParams={
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.set("strictQuery", false);

mongoose.connect(config.dbUrl,connectionParams)
.then(()=>{
    console.log("Connected With Atlas Database");
}).catch(function(err){
    console.log("Error Occured During Connecting To The Database\n",err);
})
