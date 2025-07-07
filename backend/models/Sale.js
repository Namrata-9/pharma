// models/Sale.js
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    items: [
      {
        medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
        name: String,
        price: Number,
        quantity: Number,
        discount: Number,
        vat: Number,
        subtotal: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI"],
      default: "Cash",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
