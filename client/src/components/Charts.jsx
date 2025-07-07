import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = [
  "#198754",
  "#20c997",
  "#0dcaf0",
  "#ffc107",
  "#fd7e14",
  "#dc3545",
];

const Charts = () => {
  const [sales, setSales] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterRange, setFilterRange] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:7878/api/sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setSales(res.data.sales || res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const now = new Date();
    let filteredData = sales;

    if (filterRange !== "all") {
      const days = parseInt(filterRange);
      filteredData = sales.filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        return (now - saleDate) / (1000 * 60 * 60 * 24) <= days;
      });
    }

    setFiltered(filteredData);
  }, [filterRange, sales]);

  const totalAmount = filtered.reduce((sum, s) => sum + s.grandTotal, 0);

  const categoryCount = {};
  const paymentMethodCount = {};

  filtered.forEach((sale) => {
    sale.items.forEach((item) => {
      categoryCount[item.category] =
        (categoryCount[item.category] || 0) + item.quantity;
    });
    paymentMethodCount[sale.paymentMethod] =
      (paymentMethodCount[sale.paymentMethod] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCount).map(([key, val]) => ({
    name: key,
    value: val,
  }));
  const paymentData = Object.entries(paymentMethodCount).map(([key, val]) => ({
    name: key,
    value: val,
  }));

  const topCategory =
    categoryData.sort((a, b) => b.value - a.value)[0]?.name || "-";
  const topPayment =
    paymentData.sort((a, b) => b.value - a.value)[0]?.name || "-";

  const exportPDF = () => {
    const input = document.getElementById("sales-dashboard");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("sales_report.pdf");
    });
  };

  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Sales", totalAmount.toFixed(2)],
      ["Total Orders", filtered.length],
      ["Top Category", topCategory],
      ["Top Payment", topPayment],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "sales_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-5" id="sales-dashboard">
      <h3 className="text-center mb-4 text-success fw-bold">Sales Dashboard</h3>

      <div className="text-end mb-3">
        <select
          className="form-select w-auto d-inline-block me-3"
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
        <button className="btn btn-danger me-2" onClick={exportPDF}>
          📄 Export PDF
        </button>
        <button className="btn btn-success" onClick={exportCSV}>
          📊 Export CSV
        </button>
      </div>

      <div className="row text-center mb-4">
        <div className="col-md-4">
          <div className="bg-light p-3 shadow rounded">
            <h5>Total Sales</h5>
            <h4 className="text-success">₹{totalAmount.toFixed(2)}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-light p-3 shadow rounded">
            <h5>Top Category</h5>
            <h4 className="text-primary">{topCategory}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-light p-3 shadow rounded">
            <h5>Top Payment</h5>
            <h4 className="text-info">{topPayment}</h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h6 className="text-center">Sales by Category</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#198754" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h6 className="text-center">Sales by Payment Method</h6>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
