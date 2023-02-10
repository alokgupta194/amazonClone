// third party modules
import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"


// local Imports
import config from "./config/index.js"               // Configration files

import "./Db/databaseConnection.js"                  // Connecting Database

import defaultData from "./Db/defaultData.js"        // 


import api from "./api/index.js"

const app = express();
app.use(cookieParser())
app.use(cors())
app.use("/api",api)


app.listen(config.port, ()=>{
    try{
        console.log(`server started at port ${config.port}`);                  
    }catch(error){
        console.log("There is a error in starting server \n",error);
    }
})




