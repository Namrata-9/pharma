// const express = require("express");
// const {
//   createMedicine,
//   getMedicines,
//   updateMedicine,
//   deleteMedicine,
// } = require("../controllers/medicineController");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/", protect, createMedicine);
// router.get("/", protect, getMedicines);
// router.put("/:id", protect, updateMedicine);
// router.delete("/:id", protect, deleteMedicine);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const medicineController = require("../controllers/medicineController");

router.post("/", upload.single("image"), medicineController.createMedicine);
router.get("/", medicineController.getMedicines);
router.put("/:id", upload.single("image"), medicineController.updateMedicine);
router.delete("/:id", medicineController.deleteMedicine);

module.exports = router;
