// import inbuilt modules
import path from "path"

// third party module import
import dotenv from "dotenv"

// local imports
import absolutePath from "../utils/index.js"



dotenv.config({
    path:path.join(absolutePath.absolutePath(),".env")
})

// console.log("env data",process.env.dbUrl)
export default{
    port:process.env.port||"",
    dbUrl:process.env.dbUrl||"",
    secretKey:process.env.secretKey||"",
}
