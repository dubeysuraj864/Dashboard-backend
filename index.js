const express = require("express");
require("./db/config");
const cors = require("cors");
const Users = require("./db/users");
const users = require("./db/users");
const products = require("./db/products");

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("node home");
});
app.use(express.json());
app.post("/register", async (req, res) => {
  let user = new Users(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await users.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
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
  const result = await products.deleteOne({_id: req.params.id });
  res.send(result);
});

app.get("/products/:id", async (req, res) =>{
  const result = await products.findOne({_id: req.params.id});
  if(result){
    res.send(result)
  }
  else{
    res.send({result: "No User Found."})
  }

})


app.put("/products/:id", async (req, res)=>{
  let result = await products.updateOne(

    {_id:req.params.id},
    {
        $set:req.body
    }
  )
  res.send(result)
})

app.listen(5000);
