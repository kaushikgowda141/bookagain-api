import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, user_password } = req.body;
  //check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    //throw
    throw new Error("user already exists");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user_password, salt);

  //create the user
  const user = await User.create({
    fullname,
    email,
    user_password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User registered succesfully",
    data: user,
  });
});

//login

export const loginUserctrl = asyncHandler(async (req, res) => {
  const { email, user_password } = req.body;
  //find user in db by email only
  const userFound = await User.findOne({
    email,
  });
  if (
    userFound &&
    (await bcrypt.compare(user_password, userFound?.user_password))
  ) {
    res.json({
      status: "success",
      message: "user logged in successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid");
  }
});

// dummy profile

export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  // find the user
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "user profile fetched succesfully",
    user,
  });
});

//update shipping address

export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, phone } =
    req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  //send response
  res.json({
    status: "success",
    message: "user shipping address updated successfully",
    user,
  });
});
