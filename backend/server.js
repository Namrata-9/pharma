const express = require("express");
const connectDBMongo = require("./config/db");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
// const medicineRoutes = require("./routes/medicineRoutes");
const saleRoutes = require("./routes/saleRoutes");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
connectDBMongo();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/sales", saleRoutes);

const PORT = process.env.PORT || 7878;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
