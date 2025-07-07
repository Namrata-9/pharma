import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div
      className="notfound-container d-flex flex-column justify-content-center align-items-center text-center bg-light"
      style={{ height: "69vh" }}
    >
      <FaExclamationTriangle className="text-warning mb-3" size={80} />
      <h1 className="display-4">404 - Page Not Found</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary mt-3">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
