import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // images: {
    //   type: String,
    //   default:
    //     "https://nayemdevs.com/wp-content/uploads/2020/03/Screen-Shot-2020-03-17-at-2.49.31-PM.png",
    //   required: true,
    // },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);

export default Category;
