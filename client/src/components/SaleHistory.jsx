import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaDownload } from "react-icons/fa";

const SaleHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:7878/api/sales", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHistory(res.data.sales || []);
      } catch (err) {
        console.error("Error fetching sales:", err);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let result = history;

    if (searchTerm) {
      result = result.filter(
        (sale) =>
          sale.customerPhone?.includes(searchTerm) ||
          sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      result = result.filter((sale) =>
        new Date(sale.createdAt).toISOString().startsWith(dateFilter)
      );
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, dateFilter, history]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSales = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const downloadPDF = (sale) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Pharmacy Invoice", 14, 15);

    doc.setFontSize(12);
    doc.text(`Customer: ${sale.customerName}`, 14, 25);
    doc.text(`Phone: ${sale.customerPhone}`, 14, 32);
    doc.text(`Date: ${new Date(sale.createdAt).toLocaleString()}`, 14, 39);

    const tableData = sale.items.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      item.price,
      item.quantity * item.price,
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["#", "Medicine", "Qty", "Price", "Subtotal"]],
      body: tableData,
    });

    const finalY = doc.lastAutoTable.finalY || 90;

    doc.text(`Total: ₹${sale.totalAmount}`, 14, finalY + 10);
    doc.text(`Discount: ₹${sale.discount}`, 14, finalY + 17);
    doc.text(`VAT: ₹${sale.vat}`, 14, finalY + 24);
    doc.text(`Grand Total: ₹${sale.grandTotal}`, 14, finalY + 31);
    doc.text(`Paid: ₹${sale.paidAmount}`, 14, finalY + 38);
    doc.text(`Method: ${sale.paymentMethod}`, 14, finalY + 45);

    doc.save(`Invoice_${sale.customerName}_${Date.now()}.pdf`);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h4 className="text-center mb-4 text-success fw-bold">
          🧾 Sale History
        </h4>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Method</th>
                <th>Time</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-muted">
                    No sales found
                  </td>
                </tr>
              ) : (
                currentSales.map((sale, index) => (
                  <tr key={sale._id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{sale.customerName}</td>
                    <td>{sale.items.map((i) => i.name).join(", ") || "N/A"}</td>
                    <td>₹{sale.grandTotal}</td>
                    <td>₹{sale.paidAmount}</td>
                    <td>{sale.paymentMethod}</td>
                    <td>{new Date(sale.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => downloadPDF(sale)}
                      >
                        <FaDownload className="me-1" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {[...Array(totalPages)].map((_, idx) => (
                <li
                  key={idx}
                  className={`page-item ${
                    currentPage === idx + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default SaleHistory;
