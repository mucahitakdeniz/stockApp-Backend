"use strict";

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "name": "Category 1"
}
/* ------------------------------------------------------- */

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim:true,
      required: true,
      unique: true,
    }
  },
  { collection: "categories", timestamps: true }
);

//  perform an action before initialization

CategorySchema.pre("init", function (data) {
  data.createds = data.createdAt.toLocaleDateString("tr-tr");
});

module.exports = mongoose.model("Category", CategorySchema);
