"use strict";

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "category_id": "65343222b67e9681f937f203",
    "brand_id": "65343222b67e9681f937f107",
    "name": "Product 1"
}
/* ------------------------------------------------------- */

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { collection: "products", timestamps: true }
);

//  perform an action before initialization

ProductSchema.pre("init", function (data) {
  data.createds = data.createdAt.toLocaleDateString("tr-tr");
  data.id = data._id;
});

module.exports = mongoose.model("Product", ProductSchema);
