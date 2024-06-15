import express from "express";
import {
  createProductCtrl,
  deleteProductCtrl,
  getProductCtrl,
  getProductsCtrl,
  updateProductCtrl,
} from "../controller/productController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middleware/isAdmin.js";

const productsRoutes = express.Router();

productsRoutes.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProductCtrl
);
productsRoutes.get("/", getProductsCtrl);
productsRoutes.get("/:id", getProductCtrl);
productsRoutes.put("/:id", isLoggedIn, isAdmin, updateProductCtrl);
productsRoutes.delete("/:id/delete", isLoggedIn, isAdmin, deleteProductCtrl);

export default productsRoutes;
