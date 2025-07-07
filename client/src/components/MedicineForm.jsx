import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const MedicineForm = () => {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    batch: "",
    expiryDate: "",
    quantity: "",
    price: "",
    discount: "",
    vat: "",
    status: "Available",
    image: null,
  });

  const fetchMedicines = async () => {
    const res = await axios.get("http://localhost:7878/api/medicines", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setMedicines(res.data);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:7878/api/categories", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories(res.data.categories);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (key === "image") {
        if (val && typeof val !== "string") {
          formData.append("image", val);
        }
      } else {
        formData.append(key, val);
      }
    });

    const url = editId
      ? `http://localhost:7878/api/medicines/${editId}`
      : "http://localhost:7878/api/medicines";
    const method = editId ? "put" : "post";

    try {
      await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(
        editId
          ? "Medicine updated successfully!"
          : "Medicine saved successfully!"
      );

      setForm({
        name: "",
        category: "",
        batch: "",
        expiryDate: "",
        quantity: "",
        price: "",
        discount: "",
        vat: "",
        status: "Available",
        image: null,
      });
      setEditId(null);
      fetchMedicines();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      toast.error("Failed to save medicine.");
    }
  };

  const handleEdit = (med) => {
    setForm({
      name: med.name || "",
      category: med.category || "",
      batch: med.batch || "",
      expiryDate: med.expiryDate ? med.expiryDate.split("T")[0] : "",
      quantity: med.quantity || "",
      price: med.price || "",
      discount: med.discount || "",
      vat: med.vat || "",
      status: med.status || "Available",
      image: med.image || null,
    });
    setEditId(med._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      try {
        await axios.delete(`http://localhost:7878/api/medicines/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        toast.success("Medicine deleted successfully.");
        fetchMedicines();
      } catch (err) {
        console.error("Delete failed", err);
        toast.error("Failed to delete medicine.");
      }
    }
  };

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mb-4">
        <h3 className="text-primary text-center mb-4">
          {editId ? "✏️ Edit Medicine" : "➕ Add Medicine"}
        </h3>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>

          <div className="col-md-4">
            <select
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {["batch", "expiryDate", "quantity", "price", "discount", "vat"].map(
            (field) => (
              <div className="col-md-4" key={field}>
                <input
                  type={field === "expiryDate" ? "date" : "text"}
                  name={field}
                  className="form-control"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field] || ""}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
            )
          )}

          <div className="col-md-4">
            <select
              name="status"
              className="form-select"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="Available">Available</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
            {editId && form.image && typeof form.image === "string" && (
              <div className="mt-2">
                <img
                  src={`http://localhost:7878/${form.image}`}
                  alt="Existing"
                  width="80"
                  className="rounded"
                />
                <small className="d-block text-muted">Current Image</small>
              </div>
            )}
          </div>

          <div className="col-12 d-grid">
            <button className="btn btn-success btn-lg" type="submit">
              {editId ? "Update Medicine" : "Save Medicine"}
            </button>
          </div>
        </form>
      </div>

      <div className="card shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">📦 Medicine Inventory</h4>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search medicine by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select w-auto"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.length > 0 ? (
              paginatedMedicines.map((med, index) => (
                <tr key={med._id} className="text-center">
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{med.name}</td>
                  <td>{med.category}</td>
                  <td>₹{med.price}</td>
                  <td>{med.quantity}</td>
                  <td>
                    {med.quantity === 0 ? (
                      <span className="badge bg-danger">Out of Stock</span>
                    ) : (
                      <span className="badge bg-success">Available</span>
                    )}
                  </td>
                  <td>
                    {med.image ? (
                      <img
                        src={`http://localhost:7878/${med.image}`}
                        alt={med.name}
                        width="40"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(med)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(med._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No medicines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MedicineForm;
