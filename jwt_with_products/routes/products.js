const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// GET /products
// Protected route
router.get("/", authenticateToken, async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve products",
            error: error.message,
        });
    }
});

// GET /products/:id
// Protected route
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve product",
            error: error.message,
        });
    }
});

router.post("/", authenticateToken, async (req, res) => {
    try {
        const { name, description, price, category, inStock, imageUrl } = req.body;

        // Validate name
        if (!name || name.trim() === "") {
            return res.status(400).json({
                error: "Product name is required",
            });
        }

        // Validate price
        if (price === undefined || price === null || isNaN(price) || Number(price) <= 0) {
            return res.status(400).json({
                error: "Price must be a positive number",
            });
        }

        const product = new Product({
            name: name.trim(),
            description,
            price: Number(price),
            category,
            inStock: inStock ?? true,
            imageUrl,
        });

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({
            error: "Failed to create product",
            details: error.message,
        });
    }
});

router.patch("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid product ID",
            });
        }

        // Check price if provided
        if (req.body.price !== undefined && (isNaN(req.body.price) || Number(req.body.price) <= 0)) {
            return res.status(400).json({
                error: "Price must be a positive number",
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({
            error: "Failed to update product",
            details: error.message,
        });
    }
});

router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid product ID",
            });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        // Product doesn't exist
        if (!deletedProduct) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete product",
            details: error.message,
        });
    }
});

module.exports = router;
