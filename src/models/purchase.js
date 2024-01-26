"use strict";

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "firm_id": "65343222b67e9681f937f304",
    "brand_id": "65343222b67e9681f937f123",
    "product_id": "65343222b67e9681f937f422",
    "quantity": 1000,
    "price": 20
}
/* ------------------------------------------------------- */

const PurchaseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firm_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm",
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
      default: function () { return this.price * this.quantity },
      transform: function () { return this.price * this.quantity },
  }
  },
  { collection: "purchases", timestamps: true }
);

//  perform an action before initialization

PurchaseSchema.pre("init", function (data) {
  data.createds = data.createdAt.toLocaleDateString("tr-tr");
  data.id = data._id;
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
