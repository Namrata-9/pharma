const Footer = () => {
  return (
    <footer className="footer-container mt-auto bg-dark text-white py-3">
      <div className="container text-center">
        <h5 className="mb-2">PharmaCare 💊</h5>
        <p className="mb-1">Your trusted pharmacy management partner.</p>
        <div className="social-icons my-2">
          <a href="#" className="text-white me-3">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="text-white me-3">
            <i className="bi bi-twitter-x"></i>
          </a>
          <a href="#" className="text-white">
            <i className="bi bi-envelope-fill"></i>
          </a>
        </div>
        <small className="text-white">
          © {new Date().getFullYear()} PharmaCare. All rights reserved.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
