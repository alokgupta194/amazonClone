import express from "express";

import Products from "../../Db/schema.js";

import user from "../models/userSchema.js";

import bodyParser from "body-parser";

import bcrypt from "bcrypt";

import cookieParser from "cookie-parser";

import auth from "../../middleware/index.js";

const router = express.Router();

router.use(bodyParser.json());

// getProducts Api
router.get("/", async (req, res) => {
  const data = await Products.find();
  res.status(200).send(data);
  res.end();
});

router.get("/getProductDetails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const productDetailsData = await Products.findOne({ id });
    res.status(201).json(productDetailsData);

    res.end();
  } catch (error) {
    res.status(400).json(productDetailsData);
    console.log("error occuerd", error);
  }
});

// registering user

router.post("/registerUser", async (req, res) => {
  try {
    // console.log(req.body);
    const { name, phone, address, email, password, cPassword } = req.body;
    if (!name || !phone || !address || !email || !password || !cPassword) {
      res.status(422).json({ Error: "This Data Is Not Complete" });
    } else if (password != cPassword) {
      res.status(422).json({ Error: "Password And Confirm Password Not Same" });
    } else {
      const preUser = await user.findOne({ email });
      if (preUser) {
        res.status(422).json({ Error: "User Already Exist" });
      } else {
        const finalUser = new user({
          name,
          phone,
          address,
          email,
          password,
          cPassword,
        });
        const storeData = await finalUser.save();
        // console.log("storing data",storeData);
        res.status(201).json(storeData);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(422).send({ Error: error });
  } finally {
    res.end();
  }
});

// login Api

router.post("/login", async (req, res) => {
  const { email, password } = await req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Please Fill All The Details" });
    res.end();
  } else {
    try {
      const userLoginDetails = await user.findOne({ email });

      // console.log("userLoginDetails",userLoginDetails);

      if (!userLoginDetails) {
        res.status(422).json({ error: "User Not Registered Please Signup" });
      } else {
        const passwordMatchResult = await bcrypt.compare(
          password,
          userLoginDetails.password
        );

        console.log("passwordMatchResult", passwordMatchResult);

        // if pass matched then we will generarte token.

        if (passwordMatchResult) {
          const token = await userLoginDetails.genrateToken();
          // console.log("token in router",token)
          res.cookie("AmazonWeb", token, {
            expires: new Date(Date.now() + 90000000),
            httpOnly: true,
          });

          res
            .status(201)
            .json({ Message: "Login Success", userData: userLoginDetails });
        } else {
          res.status(422).json({ error: "Invalid Credentials" });
        }
      }
    } catch (err) {
      res.status(422).json({ error: err });
    } finally {
      res.end();
    }
  }
});

router.post("/addcart/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const productDetails = await Products.findOne({ id: id });

    // console.log("productDetails",productDetails);

    const userDetails = await user.findOne({ _id: req.userID });
    // console.log(userDetails);

    if (userDetails && productDetails) {
      const addCartDataToDatabase = await userDetails.addToCart(productDetails);
      await userDetails.save();
      // console.log("addCartDataToDatabase",addCartDataToDatabase);
      res.status(201).json(userDetails);
    } else {
      res.status(401).json({ error: "invalid user" });
    }
  } catch (error) {
    console.log("error in addcart:id\n ", error);
    res.status(401).json({ error: "invalid user" });
  }
});

router.get("/cartDetails", auth, async (req, res) => {
  try {
    if (!req.userID) {
      throw new Error("NOt Valid User Id");
    } else {
      const buyUser = await user.findOne({ _id: req.userID });
      if (buyUser) {
        res.status(201).json(buyUser);
      } else {
        throw new Error("Fail to get Data");
      }
    }
  } catch (err) {
    console.log("error occurred", err.e);
    res.status(401).json({ error: err });
  }
});

//delete item From Cart

router.post("/deleteData/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    req.rootUser.carts= req.rootUser.carts.filter((curVal)=>{
      return curVal.id!=id;
    })

    req.rootUser.save();

    res.status(201).json(req.rootUser);
    console.log("item remove");

    
  } catch (error) {
    console.log("Error Occoured In Deleting Data", error);
    res.status(401).json({ error: error });
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
      await res.clearCookie('AmazonWeb'); 


    req.rootUser.tokens=req.rootUser.tokens.filter((currentData)=>{
      return currentData.token!==req.token
    });

    await req.rootUser.save();  
    res.status(201).json(req.rootUser.tokens);
    console.log("logout");    
  } catch (error) {
    console.log("Error Occoured In Logout", error);
    res.status(401).json({ error: error });
  }
});

export default router;
