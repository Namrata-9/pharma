const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCategories);
router.post("/", protect, addCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);
module.exports = router;
