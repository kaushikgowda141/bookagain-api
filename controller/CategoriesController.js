import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exist
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error("Category already exists");
  }
  const category = await Category.create({
    name,
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

//get categories

export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({
    status: "success",
    message: "Categories fetched successfully",
    categories,
  });
});

//get single category

export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json({
    status: "success",
    message: "Category fetched successfully",
    category,
  });
});

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //update
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Category updated successfully",
    category,
  });
});

//delete category

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Category deleted successfully",
  });
});
