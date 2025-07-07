const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    batch: { type: String },
    expiryDate: { type: Date },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Available", "Out of Stock"],
      default: "Available",
    },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
