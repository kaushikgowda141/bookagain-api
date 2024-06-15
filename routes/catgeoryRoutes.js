import express from "express";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
} from "../controller/CategoriesController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import isAdmin from "../middleware/isAdmin.js";

const categoriesRoutes = express.Router();

categoriesRoutes.post("/", isLoggedIn, isAdmin, createCategoryCtrl);
categoriesRoutes.get("/", getAllCategoriesCtrl);
categoriesRoutes.get("/:id", getSingleCategoryCtrl);
categoriesRoutes.delete("/:id", isLoggedIn, isAdmin, deleteCategoryCtrl);
categoriesRoutes.put("/:id", isLoggedIn, isAdmin, updateCategoryCtrl);

export default categoriesRoutes;
