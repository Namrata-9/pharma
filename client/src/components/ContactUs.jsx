import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, address, message } = formData;

    if (!name || !email || !address || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Simulate sending data
    toast.success("✅ Message sent successfully!");

    // Reset form
    setFormData({
      name: "",
      email: "",
      address: "",
      message: "",
    });
  };

  const styles = {
    container: {
      maxWidth: "650px",
      margin: "60px auto",
      padding: "35px",
      borderRadius: "12px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      transition: "all 0.3s ease-in-out",
    },
    heading: {
      textAlign: "center",
      color: "#0b6e4f",
      fontSize: "28px",
      marginBottom: "10px",
    },
    subheading: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#555",
      fontSize: "16px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "12px 15px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      transition: "0.2s",
    },
    textarea: {
      padding: "12px 15px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      resize: "vertical",
      transition: "0.2s",
    },
    inputFocus: {
      borderColor: "#0b6e4f",
      boxShadow: "0 0 5px rgba(11, 110, 79, 0.2)",
    },
    button: {
      padding: "12px",
      backgroundColor: "#0b6e4f",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#095d42",
    },
  };

  const [focusedInput, setFocusedInput] = useState(null);

  const getInputStyle = (field) =>
    focusedInput === field
      ? { ...styles.input, ...styles.inputFocus }
      : styles.input;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Contact Us</h2>
      <p style={styles.subheading}>
        We’d love to hear from you! Please fill out the form below.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => setFocusedInput("name")}
          onBlur={() => setFocusedInput(null)}
          style={getInputStyle("name")}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => setFocusedInput("email")}
          onBlur={() => setFocusedInput(null)}
          style={getInputStyle("email")}
        />

        <input
          type="text"
          name="address"
          placeholder="Your Address"
          value={formData.address}
          onChange={handleChange}
          onFocus={() => setFocusedInput("address")}
          onBlur={() => setFocusedInput(null)}
          style={getInputStyle("address")}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          onFocus={() => setFocusedInput("message")}
          onBlur={() => setFocusedInput(null)}
          style={
            focusedInput === "message"
              ? { ...styles.textarea, ...styles.inputFocus }
              : styles.textarea
          }
        ></textarea>

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(focusedInput === "submit" ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setFocusedInput("submit")}
          onMouseLeave={() => setFocusedInput(null)}
        >
          Send Message
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ContactUs;
