"use strict";

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "brand_id": "65343222b67e9681f937f123",
    "product_id": "65343222b67e9681f937f422",
    "quantity": 1000,
    "price": 20,
}
/* ------------------------------------------------------- */

const SalesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    price_total: {
      type: Number,
      default: function () {
        return this.price * this.quantity;
      },
      transform: function () {
        return this.price * this.quantity;
      },
    },
  },
  { collection: "sales", timestamps: true }
);

//  perform an action before initialization

SalesSchema.pre("init", function (data) {
  data.createds = data.createdAt.toLocaleDateString("tr-tr");
  data.id = data._id;
});

module.exports = mongoose.model("Sale", SalesSchema);
