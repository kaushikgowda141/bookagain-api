import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

//create coupon

export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount, user } = req.body;
  //check if admin
  //check if coupon already exists
  const couponExists = await Coupon.findOne({
    code: code?.toUpperCase(),
  });
  if (couponExists) {
    throw new Error("coupon already exists");
  }
  //check if discount is number
  if (isNaN(discount)) {
    throw new Error("Discount value must be number");
  }
  const coupon = await Coupon.create({
    code,
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  //send response
  res.status(201).json({
    status: "success",
    message: "coupon created successfully",
    coupon,
  });
});

// get all coupons

export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});

//get single coupon

export const getSingleCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  res.json({
    status: "success",
    message: "coupon fethced",
    coupon,
  });
});

//update
export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "coupon updated",
    coupon,
  });
});

//delete
export const deleteCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "coupon deleted",
    coupon,
  });
});
