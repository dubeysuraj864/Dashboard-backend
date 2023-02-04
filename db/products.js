const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    rating: Number,
    category: String,
    brand: String
});

module.exports = mongoose.model("products", productSchema);