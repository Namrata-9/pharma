import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const message = await registerUser(form.name, form.email, form.password);
      //setSuccess(message);
      toast.success("New user added successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      //setError("Registration failed");
      toast.error("Registration failed");
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="auth-box">
        <h3 className="text-center mb-4">New User</h3>

        {/* {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>} */}
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="form-control my-2"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="form-control my-2"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="form-control my-2"
            onChange={handleChange}
            required
          />
          <button className="btn btn-success d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-person-plus-fill"></i> Register
          </button>
        </form>
        <div className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default Signup;
