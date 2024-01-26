"use strict";

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "name": "Firm 1"
    "phone": "999 88 77",
    "address": "Address"
}
/* ------------------------------------------------------- */

const FirmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim:true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim:true,
      required: true,

    },
    address: {
      type: String,
      trim:true,
      required: true,
    },
    image: {
      type: String,
      trim: true

    },
  },
  { collection: "firms", timestamps: true }
);

//  perform an action before initialization

FirmSchema.pre("init", function (data) {
  data.createds = data.createdAt.toLocaleDateString("tr-tr");
});

module.exports = mongoose.model("Firm", FirmSchema);
