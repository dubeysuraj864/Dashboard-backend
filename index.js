const express = require("express");
require("./db/config");
const cors = require("cors");
const users = require("./db/users");
const products = require("./db/products");
const jwt = require("jsonwebtoken");
const jwtKey = "e-comm";

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("node home");
});
app.use(express.json());
app.post("/register", async (req, res) => {
  let user = new users(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send({ result: "Something went wrong, please try again" });
    }
    res.send({ result, auth: token });
  });
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await users.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "Something went wrong, please try again" });
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: " No user found" });
    }
  }
});

app.post("/add-product", async (req, res) => {
  let product = new products(req.body);
  let result = await product.save();
  res.send(result);
});

app.get("/products", async (req, res) => {
  let product = await products.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "no products found" });
  }
});

app.delete("/product/:id", async (req, res) => {
  const result = await products.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  const result = await products.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "No User Found." });
  }
});

app.put("/products/:id", async (req, res) => {
  let result = await products.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

app.get("/search/:key", async (req, res) => {
  let result = await products.find({
    $or: [
      { name: { $regex: req.params.key } },
      { brand: { $regex: req.params.key } },
      // { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      // { rating: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    String(token).split(" ");
    console.log("middleware called if", token);
    jwt.verify(token, jwtKey, (err, valid) => {
      if(err){
          res.send("Please provide valid token")
      }
      else{

      }
    });
  } else {
    res.send("Please add token with header")
  }
  next();
}

app.listen(5000);
