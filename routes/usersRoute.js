import express from "express";
import {
  getUserProfileCtrl,
  loginUserctrl,
  registerUserCtrl,
  updateShippingAddressCtrl,
} from "../controller/usersController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserctrl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);
userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddressCtrl);
export default userRoutes;
