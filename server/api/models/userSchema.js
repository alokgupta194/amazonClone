import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import config from "../../config/index.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 10,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        res.status(400).json({ Error: "Email Is Not Valid" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
  },
  cPassword: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  carts: [],
});

userSchema.pre("save", async function (next) {

  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 12);
  // console.log(this.password)
  this.cPassword = await bcrypt.hash(this.cPassword, 12);
  }
  next();
});

// method for token generation

userSchema.methods.genrateToken=async function(){
  try {
    const token=await jwt.sign({_id:this._id},config.secretKey)
    this.tokens=this.tokens.concat({token})
    await this.save();
    return token;
  } catch (error) {
    console.log("error in token generation",error);    
  }
}

userSchema.methods.addToCart=async function(cart){
  try {
    console.log(cart)
    this.carts=this.carts.concat(cart)
    await this.save();
    return this.carts;
  } catch (error) {
    console.log("error in adding data to cart",error);    
  }
}



const User = new mongoose.model("USER", userSchema);

export default User;
