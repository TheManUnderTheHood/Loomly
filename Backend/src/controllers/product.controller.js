import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { ApiFeatures } from "../utils/ApiFeatures.js";

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, trending } = req.body;

  // Basic validation
  if ([name, description, price, stock, category].some((field) => !field)) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Product image is required");
  }

  const productImage = await uploadOnCloudinary(imageLocalPath);
  if (!productImage) {
    throw new ApiError(500, "Failed to upload product image");
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category, // assuming category ID is passed from frontend
    productImage: {
      public_id: productImage.public_id,
      url: productImage.url,
    },
    trending: trending || false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findById(productId).populate("category", "name slug");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// Controller to get products by category slug (e.g., /style/streetwear)
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { styleSlug } = req.params;

  const category = await Category.findOne({ slug: styleSlug });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const products = await Product.find({ category: category._id });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { category, products },
        "Products for category fetched successfully"
      )
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  const resultPerPage = 12; // Number of products per page
  const productCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resultPerPage);

  const products = await apiFeatures.query.populate("category", "name slug");
  
  const totalPages = Math.ceil(productCount / resultPerPage);

  return res.status(200).json(new ApiResponse(
    200, 
    {
      products,
      productCount,
      resultPerPage,
      totalPages
    }, 
    "All products fetched successfully"
  ));
});

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, stock, category, trending } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // You can add more robust validation here, checking if fields are empty etc.
    const product = await Product.findByIdAndUpdate(
        productId,
        {
            $set: {
                name,
                description,
                price,
                stock,
                category,
                trending
            }
        },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }
    
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Optional: Delete product image from Cloudinary here
    // await cloudinary.uploader.destroy(product.productImage.public_id);
    
    await Product.findByIdAndDelete(productId);

    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
});


// Make sure to export the new functions
export {
  createProduct,
  getProductById,
  getProductsByCategory,
  getAllProducts,
  updateProduct, 
  deleteProduct, 
};