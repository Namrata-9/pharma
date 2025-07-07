const Medicine = require("../models/medicineModel");
const fs = require("fs");
const path = require("path");

// CREATE MEDICINE
exports.createMedicine = async (req, res) => {
  try {
    const {
      name,
      category,
      batch,
      expiryDate,
      quantity,
      price,
      discount,
      vat,
    } = req.body;

    const newMedicine = new Medicine({
      name,
      category,
      batch,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      quantity: Number(quantity),
      price: Number(price),
      discount: Number(discount) || 0,
      vat: Number(vat) || 0,
      status: Number(quantity) === 0 ? "Out of Stock" : "Available",
      image: req.file ? `uploads/${req.file.filename}` : null,
    });

    await newMedicine.save();
    res.status(201).json({
      message: "Medicine saved successfully",
      medicine: newMedicine,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating medicine",
      error: error.message,
    });
  }
};

// GET ALL MEDICINES
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching medicines",
      error: error.message,
    });
  }
};

// UPDATE MEDICINE
exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // If new image uploaded, delete old one
    if (req.file) {
      if (medicine.image) {
        const oldImagePath = path.join(__dirname, "..", medicine.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedData = {
      name: req.body.name,
      category: req.body.category,
      batch: req.body.batch,
      expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
      quantity: Number(req.body.quantity),
      price: Number(req.body.price),
      discount: Number(req.body.discount) || 0,
      vat: Number(req.body.vat) || 0,
      status: Number(req.body.quantity) === 0 ? "Out of Stock" : "Available",
      image: req.file ? `uploads/${req.file.filename}` : medicine.image,
    };

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      message: "Medicine updated successfully",
      medicine: updatedMedicine,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({
      message: "Failed to update medicine",
      error: error.message,
    });
  }
};

// DELETE MEDICINE
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    // Delete associated image if exists
    if (medicine.image) {
      const imagePath = path.join(__dirname, "..", medicine.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Medicine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting medicine",
      error: error.message,
    });
  }
};
