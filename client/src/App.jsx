import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateCategory from "./pages/CreateCategory";
import CategoryList from "./pages/CategoryList";
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import MedicineForm from "./components/MedicineForm";
import SalesPage from "./components/SalesPage";
import SaleHistory from "./components/SaleHistory";
import Charts from "./components/Charts";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/AboutUs";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />

          {/* ✅ Protected Routes */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-category"
            element={<PrivateRoute element={<CreateCategory />} />}
          />
          <Route
            path="/category-list"
            element={<PrivateRoute element={<CategoryList />} />}
          />

          <Route
            path="/add-medicine"
            element={<PrivateRoute element={<MedicineForm />} />}
          />

          <Route
            path="/sale-medicine"
            element={<PrivateRoute element={<SalesPage />} />}
          />

          <Route
            path="/sale-history"
            element={<PrivateRoute element={<SaleHistory />} />}
          />

          <Route
            path="/sale-ana"
            element={<PrivateRoute element={<Charts />} />}
          />

          {/* Not Found Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
