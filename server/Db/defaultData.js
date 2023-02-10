import Products from "./schema.js"
import ProductData from "../constant/product.js"

const defaultData= async()=>{
    try{
        await Products.deleteMany({})
        const storeData= await Products.insertMany(ProductData)
        console.log("Data Uploaded Successfully");
    }catch(err){
        console.log("error",err)
    }
}

defaultData();

export default defaultData;