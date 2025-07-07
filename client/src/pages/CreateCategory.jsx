import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:7878/api/categories",
        { name, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.message || "Category added!");
      setName("");
      setStatus("Active");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ minHeight: "85vh" }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <FaPlusCircle size={30} className="text-success mb-2" />
          <h4 className="text-primary fw-bold">Add New Category</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label fw-semibold">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              className="form-control"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold d-block">Status</label>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="active"
                name="status"
                value="Active"
                className="form-check-input"
                checked={status === "Active"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <label htmlFor="active" className="form-check-label">
                Active
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                type="radio"
                id="inactive"
                name="status"
                value="Inactive"
                className="form-check-input"
                checked={status === "Inactive"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <label htmlFor="inactive" className="form-check-label">
                Inactive
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success btn-lg">
              <FaSave className="me-2" /> Save Category
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

export default CreateCategory;
