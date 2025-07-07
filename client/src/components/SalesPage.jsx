import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [discount, setDiscount] = useState(0);
  const [vat, setVat] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardHolder: "",
  });
  const [invoiceData, setInvoiceData] = useState(null);
  const [cartSearchTerm, setCartSearchTerm] = useState("");
  const [medicineSearchTerm, setMedicineSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // const invoiceRef = useRef();

  useEffect(() => {
    const fetchMedicines = async () => {
      const res = await axios.get("http://localhost:7878/api/medicines", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const available = res.data.filter(
        (med) => med.status === "Available" && med.quantity > 0
      );
      setMedicines(available);
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset to first page when items or filter change
  }, [medicineSearchTerm, itemsPerPage]);

  const filteredMeds = medicines.filter((med) =>
    med.name.toLowerCase().includes(medicineSearchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredMeds.length / itemsPerPage);
  const paginatedMeds = filteredMeds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const addToCart = (med) => {
    const exists = cart.find((item) => item._id === med._id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item._id === med._id && item.quantity < med.quantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...med, quantity: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: parseInt(qty) } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmt = (subtotal * discount) / 100;
  const vatAmt = ((subtotal - discountAmt) * vat) / 100;
  const total = subtotal - discountAmt + vatAmt;

  const handleSubmit = async () => {
    if (!customer.name || !customer.phone || cart.length === 0) {
      alert("Customer info and cart cannot be empty!");
      return;
    }

    const saleData = {
      customerName: customer.name,
      customerPhone: customer.phone,
      items: cart.map((item) => ({
        medicineId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        vat: item.vat || 0,
        subtotal: item.price * item.quantity,
      })),
      totalAmount: subtotal,
      discount,
      vat,
      grandTotal: total,
      paidAmount,
      paymentMethod,
      paymentDetails,
    };

    try {
      const res = await axios.post(
        "http://localhost:7878/api/sales",
        saleData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      alert("Sale completed successfully!");
      setInvoiceData(res.data.sale);
      setCart([]);
      setCustomer({ name: "", phone: "" });
      setDiscount(0);
      setVat(0);
      setPaidAmount(0);
      setPaymentMethod("Cash");
      setPaymentDetails({ upiId: "", cardNumber: "", cardHolder: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Sale failed");
    }
  };

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = document.getElementById("invoice-section").innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center text-success">PharmaCare Sales</h3>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">Available Medicines</div>
            <div className="card-body">
              {/* Search & Dropdown */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search medicines..."
                  style={{ width: "70%" }}
                  value={medicineSearchTerm}
                  onChange={(e) => setMedicineSearchTerm(e.target.value)}
                />
                <select
                  className="form-select"
                  style={{ width: "25%" }}
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  {[5, 10, 25, 50].map((num) => (
                    <option key={num} value={num}>
                      {num} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-body">
              {/* <input
                type="text"
                className="form-control mb-3"
                placeholder="Search medicines..."
                value={medicineSearchTerm}
                onChange={(e) => setMedicineSearchTerm(e.target.value)}
              /> */}
              <div className="row">
                {paginatedMeds.map((med) => (
                  <div className="col-md-4 mb-4" key={med._id}>
                    <div
                      className={`card h-100 text-center ${
                        med.quantity === 0 ? "bg-light border-secondary" : ""
                      }`}
                      style={{
                        cursor: med.quantity > 0 ? "pointer" : "not-allowed",
                        opacity: med.quantity === 0 ? 0.6 : 1,
                      }}
                      onClick={() => med.quantity > 0 && addToCart(med)}
                    >
                      <img
                        src={`http://localhost:7878/${med.image}`}
                        alt={med.name}
                        className="card-img-top"
                        style={{ height: "90px", objectFit: "contain" }}
                      />
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1">{med.name}</h6>
                        <p className="mb-1 text-muted">Stock: {med.quantity}</p>
                        <p className="mb-0 text-success">₹{med.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  {[...Array(totalPages)].map((_, index) => (
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
          </div>
        </div>

        {/* Cart Section */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">Cart</div>
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Search cart..."
                value={cartSearchTerm}
                onChange={(e) => setCartSearchTerm(e.target.value)}
              />
              {cart
                .filter((item) =>
                  item.name.toLowerCase().includes(cartSearchTerm.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between mb-2 align-items-center"
                  >
                    <span>
                      {item.name} (₹{item.price})
                    </span>
                    <input
                      type="number"
                      className="form-control form-control-sm w-25"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQty(item._id, e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

              <div className="mt-3">
                <h6>Customer Info</h6>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Customer Name"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Phone"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer({ ...customer, phone: e.target.value })
                  }
                />
              </div>

              <div className="row mt-2">
                <div className="col">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(parseFloat(e.target.value || 0))
                    }
                  />
                </div>
                <div className="col">
                  <label>VAT (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={vat}
                    onChange={(e) => setVat(parseFloat(e.target.value || 0))}
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col">
                  <label>Paid Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    value={paidAmount}
                    onChange={(e) =>
                      setPaidAmount(parseFloat(e.target.value || 0))
                    }
                  />
                </div>
                <div className="col">
                  <label>Payment Method</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentDetails({
                        upiId: "",
                        cardNumber: "",
                        cardHolder: "",
                      });
                    }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Barcode">Barcode</option>
                  </select>
                </div>
              </div>

              {paymentMethod === "UPI" && (
                <div className="mt-2">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., name@bank"
                    value={paymentDetails.upiId}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        upiId: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {paymentMethod === "Card" && (
                <div className="mt-2">
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cardNumber: e.target.value,
                      })
                    }
                  />
                  <label>Card Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={paymentDetails.cardHolder}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        cardHolder: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              {paymentMethod === "Barcode" && (
                <div className="mt-3 text-center">
                  <p>Scan this barcode to pay:</p>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=pharma@upi&pn=PharmaCare"
                    alt="Barcode"
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>
              )}

              <div className="mt-3">
                <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                <p>Discount: ₹{discountAmt.toFixed(2)}</p>
                <p>VAT: ₹{vatAmt.toFixed(2)}</p>
                <h5>Grand Total: ₹{total.toFixed(2)}</h5>
                <button className="btn btn-success" onClick={handleSubmit}>
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {invoiceData && (
        <div id="invoice-section" className="p-3 bg-white border mt-4">
          <h4 className="text-center mb-3">Invoice</h4>
          <p>
            <strong>Customer:</strong> {invoiceData.customerName}
          </p>
          <p>
            <strong>Phone:</strong> {invoiceData.customerPhone}
          </p>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Medicine</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total: ₹{invoiceData.totalAmount.toFixed(2)}</p>
          <p>Discount: ₹{invoiceData.discount}</p>
          <p>VAT: ₹{invoiceData.vat}</p>
          <p>Grand Total: ₹{invoiceData.grandTotal}</p>
          <p>Paid: ₹{invoiceData.paidAmount}</p>
          <p>Payment Method: {invoiceData.paymentMethod}</p>

          {invoiceData.paymentMethod === "UPI" && (
            <p>UPI ID: {invoiceData.paymentDetails?.upiId}</p>
          )}
          {invoiceData.paymentMethod === "Card" && (
            <>
              <p>Card Number: {invoiceData.paymentDetails?.cardNumber}</p>
              <p>Card Holder: {invoiceData.paymentDetails?.cardHolder}</p>
            </>
          )}

          <button
            className="btn btn-primary mt-3 d-print-none"
            onClick={handlePrint}
          >
            Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
