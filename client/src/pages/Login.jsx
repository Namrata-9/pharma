import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = await loginUser(form.email, form.password);
      login(token);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError("Invalid email or password");
      toast.error("Invalid email or password");
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginBox} className="animate-slide-in">
        <h3 style={styles.title}>🔐 Login to PharmaCare</h3>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="📧 Email"
            className="form-control my-2"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="🔑 Password"
            className="form-control my-2"
            onChange={handleChange}
            required
            autoComplete="off"
            style={styles.input}
          />
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={styles.button}
          >
            <i className="bi bi-box-arrow-in-right"></i> Login
          </button>
        </form>

        <div className="text-center mt-3" style={styles.signupText}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-in {
            animation: slideIn 1.2s ease;
          }
        `}
      </style>

      <ToastContainer position="top-right" />
    </div>
  );
};

const styles = {
  pageContainer: {
    height: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #e0f7fa, #ffffff)",
    padding: "20px",
  },
  loginBox: {
    backgroundColor: "white",
    padding: "40px 30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    minWidth: "340px",
    maxWidth: "420px",
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontWeight: "bold",
    color: "#004d40",
  },
  input: {
    fontSize: "16px",
    padding: "12px",
  },
  button: {
    fontSize: "16px",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#007bff",
  },
  signupText: {
    fontSize: "14px",
    color: "#333",
  },
};

export default Login;
