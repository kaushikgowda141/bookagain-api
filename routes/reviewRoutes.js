import express from "express";
import { createReviewCtrl } from "../controller/reviewController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const reviewRouter = express.Router();

reviewRouter.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewRouter;
