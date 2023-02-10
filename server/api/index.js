import express from "express"

import Default from "./Route/default.js"

const Router=express.Router();




Router.use("/defaultData",Default)

export default Router;