import express from "express";
import {
  createCouponCtrl,
  deleteCouponCtrl,
  getAllCouponsCtrl,
  getSingleCouponCtrl,
  updateCouponCtrl,
} from "../controller/couponController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";
import isAdmin from "../middleware/isAdmin.js";

const couponsRounter = express.Router();

couponsRounter.post("/", isLoggedIn, isAdmin, createCouponCtrl);
couponsRounter.get("/", getAllCouponsCtrl);
couponsRounter.get("/:id", getSingleCouponCtrl);
couponsRounter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponsRounter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);
export default couponsRounter;
