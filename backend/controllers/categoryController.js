const Category = require("../models/categoryModel");

exports.addCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ name, status });
    await newCategory.save();
    res.status(201).json({ message: "Category added successfully" });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ message: "Failed to add category" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

exports.updateCategory = async (req, res) => {
  const { name, status } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, status },
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category" });
  }
};
