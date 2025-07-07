const Sale = require("../models/Sale");
const Medicine = require("../models/medicineModel");
const mongoose = require("mongoose");

// Create a sale
exports.createSale = async (req, res) => {
  const {
    customerName,
    customerPhone,
    items,
    totalAmount,
    discount,
    vat,
    grandTotal,
    paidAmount,
    paymentMethod,
  } = req.body;

  if (
    !customerName ||
    !items?.length ||
    totalAmount == null ||
    grandTotal == null ||
    paidAmount == null
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  try {
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.medicineId)) {
        return res.status(400).json({ message: "Invalid medicine ID." });
      }

      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine) {
        return res
          .status(404)
          .json({ message: `Medicine not found for ID: ${item.medicineId}` });
      }

      const saleQty = Number(item.quantity);
      const availableQty = Number(medicine.quantity);

      if (availableQty < saleQty) {
        return res.status(400).json({
          message: `Insufficient stock for ${medicine.name}. Available: ${availableQty}, Requested: ${saleQty}`,
        });
      }

      // ✅ Include category in each item
      item.category = medicine.category;

      // Deduct stock
      medicine.quantity = availableQty - saleQty;
      await medicine.save();
    }

    // Save sale record
    const sale = new Sale({
      customerName,
      customerPhone,
      items,
      totalAmount,
      discount,
      vat,
      grandTotal,
      paidAmount,
      paymentMethod,
    });

    await sale.save();

    res.status(201).json({ message: "Sale recorded successfully", sale });
  } catch (err) {
    console.error("Sale error:", err);
    res
      .status(500)
      .json({ message: "Error creating sale", error: err.message });
  }
};

// Get sales with populated medicine names and categories
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .sort({ createdAt: -1 })
      .populate("items.medicineId", "name category"); // ✅ Populate both name and category

    // Format the response to include name and category inside each item
    const formattedSales = sales.map((sale) => ({
      ...sale._doc,
      items: sale.items.map((item) => ({
        name: item.medicineId?.name || "Unknown",
        category: item.medicineId?.category || item.category || "Uncategorized", // ✅ Include fallback
        quantity: item.quantity,
        price: item.price,
      })),
    }));

    res.json({ sales: formattedSales });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching sales", error: err.message });
  }
};
