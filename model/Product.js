import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    isbn: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: function (value) {
          return !isNaN(value);
        },
        message: (props) => `${props.value} is not a valid number!`,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//Virtuals
//qty left
ProductSchema.virtual("qtyLeft").get(function () {
  const product = this;
  return product.totalQty - product.totalSold;
});

//Total Rating
ProductSchema.virtual("totalreviews").get(function () {
  const product = this;
  return product?.reviews?.length;
});

ProductSchema.virtual("averageRating").get(function () {
  let ratingsTotal = 0;
  const product = this;
  product?.reviews?.forEach((review) => {
    ratingsTotal += review?.rating;
  });
  const averageRating = ratingsTotal / product?.reviews?.length;
  return averageRating;
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
