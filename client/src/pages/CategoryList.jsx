import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as bootstrap from "bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`http://localhost:7878/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchCategories();
        toast.success("Category deleted.", { autoClose: 1500 });
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const openEditModal = (category) => {
    setEditCategory(category);
    setName(category.name);
    setStatus(category.status);
    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:7878/api/categories/${editCategory._id}`,
        { name, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      document.getElementById("editModalClose").click();
      fetchCategories();
      toast.info("Category updated successfully.", { autoClose: 1500 });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container mt-5" style={{ minHeight: "70vh" }}>
      <div className="bg-light p-4 rounded shadow-sm mb-4">
        <h2 className="text-primary">📁 Category Management</h2>
        <div className="d-flex justify-content-between flex-wrap gap-3 mt-3">
          <input
            type="text"
            className="form-control w-50 shadow-sm"
            placeholder="🔍 Search category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="d-flex align-items-center gap-2">
            <span className="fw-medium">
              Page {currentPage} of {totalPages}
            </span>
            <select
              className="form-select shadow-sm"
              style={{ width: "auto" }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{cat.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        cat.status === "Active" ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      {cat.status}
                    </span>
                  </td>
                  <td>{new Date(cat.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-2 rounded-circle"
                      onClick={() => openEditModal(cat)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-circle"
                      onClick={() => handleDelete(cat._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-dark px-4"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Prev
        </button>
        <button
          className="btn btn-outline-dark px-4"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="editModalLabel">
                ✏️ Edit Category
              </h5>
              <button
                type="button"
                className="btn-close"
                id="editModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default CategoryList;
