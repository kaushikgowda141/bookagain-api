import express from "express";
const orderRouter = express.Router();
import {
  createOrderCtrl,
  getAllordersCtrl,
  getSingleOrderCtrl,
  updateOrderCtrl,
  getSalesSumCtrl,
  getOrerStatsCtrl,
} from "../controller/orderController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

orderRouter.post("/", isLoggedIn, createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllordersCtrl);
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.get("/sales/sum", isLoggedIn, getSalesSumCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrerStatsCtrl);

export default orderRouter;
