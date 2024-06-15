import Category from "../model/Category.js";
import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";

export const createProductCtrl = asyncHandler(async (req, res) => {
  const converetedImgs = req.files.map((file) => file.path);

  const {
    isbn,
    name,
    description,
    category,
    author,
    publisher,
    price,
    totalQty,
  } = req.body;

  //prod exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("product already exists");
  }

  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
  }

  //create the product
  const product = await Product.create({
    isbn,
    name,
    description,
    category,
    author,
    publisher,
    images: converetedImgs,
    user: req.userAuthId,
    price,
    totalQty,
  });
  //push the product to category
  categoryFound.products.push(product._id);
  //resave
  await categoryFound.save();
  //send response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

//get all products

export const getProductsCtrl = asyncHandler(async (req, res) => {
  let productQuery = Product.find();

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //search by author
  if (req.query.author) {
    productQuery = productQuery.find({
      author: { $regex: req.query.author, $options: "i" },
    });
  }

  //search by publisher
  if (req.query.publisher) {
    productQuery = productQuery.find({
      publisher: { $regex: req.query.publisher, $options: "i" },
    });
  }

  //search by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //start index
  const startIndex = (page - 1) * limit;
  //end index
  const endIndex = page * limit;
  //total products
  const total = await Product.countDocuments();
  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await query
  const products = await productQuery.populate("reviews");

  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "products fetched successfully",
    products,
  });
});

//fetch single product
export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error("product not found");
  }
  res.json({
    status: "success",
    message: "product fetched successfully",
    product,
  });
});

//update product

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    isbn,
    name,
    description,
    category,
    author,
    publisher,
    user,
    price,
    totalQty,
  } = req.body;

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      isbn,
      name,
      description,
      category,
      author,
      publisher,
      user,
      price,
      totalQty,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "product updated successfully",
    product,
  });
});

//delete product
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "product delete successfully",
  });
});
