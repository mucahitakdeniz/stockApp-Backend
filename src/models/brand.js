"use strict";

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "name": "Brand 1"
}
/* ------------------------------------------------------- */

const BrandShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { collection: "brands", timestamps: true }
);

//  perform an action before initialization

BrandShema.pre("init", function (data) {
  data.createds = data.createdAt.toLocaleDateString("tr-tr");
});

module.exports = mongoose.model("Brand", BrandShema);
