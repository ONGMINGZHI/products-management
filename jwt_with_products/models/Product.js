const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    inStock: {
        type: Boolean,
        default: true
    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model("Product", productSchema);