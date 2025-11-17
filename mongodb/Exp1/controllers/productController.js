import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
    try {
        const data = req.body;
        
        const isArray = Array.isArray(data);
        
        let newProducts;

        if (isArray) {
            newProducts = await Product.insertMany(data, { ordered: false });
        } else {
            newProducts = await Product.create(data);
        }
        
        res.status(201).json(newProducts); 
    } catch (err) {
        res.status(400).json({ 
            message: 'Failed to create product(s) due to invalid data',
            error: err.message 
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// UPDATE Product by ID
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'ValidationError') {  // mongoid and schema regualtion not followed
             return res.status(400).json({ error: 'Invalid ID or invalid update data' });
        }
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

        res.status(200).json({ 
            message: "Product deleted", 
            product: deletedProduct 
        }); 
    } catch (err) {
        res.status(400).json({ 
            message: 'Invalid product ID format',
            error: err.message 
        });
    }
};
