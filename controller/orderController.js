import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import Coupon from "../model/Coupon.js";

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  //get coupon code
  const { coupon } = req?.query;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if (couponFound?.isExpired) {
    throw new Error("coupon has expired");
  }

  if (!couponFound) {
    throw new Error("coupon does not exist");
  }

  //get discount
  const discount = couponFound?.discount / 100;

  //get the payLoad(customer, orderitems, shippingAddress, totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //find user
  const user = await User.findById(req.userAuthId);
  //check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  //check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("no order items");
  }
  //place order --save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
  });
  console.log(order);
  //update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
      //product.totalSold = (product.totalSold || 0) + orderItems.qty;
    }
    await product.save();
  });

  //push order into user
  user.orders.push(order?._id);
  await user.save();

  //make payment (stripe)
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "https://localhost:3000/success",
    cancel_url: "https://localhost:3000/cancel",
  });
  res.send({ url: session.url });
});

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});

//update order to delivered

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

//sales sum of orders

export const getSalesSumCtrl = asyncHandler(async (req, res) => {
  const sales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //response
  res.status(200).json({
    success: true,
    message: "sum of orders",
    sales,
  });
});

export const getOrerStatsCtrl = asyncHandler(async (req, res) => {
  //get min order
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        miminumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maximumSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the ddate
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //response
  res.status(200).json({
    success: true,
    message: "sum of orders",
    orders,
    saleToday,
  });
});
