import React from "react";

const InvoicePreview = ({ cart, customer, discount, vat }) => {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmt = (subtotal * discount) / 100;
  const vatAmt = ((subtotal - discountAmt) * vat) / 100;
  const total = subtotal - discountAmt + vatAmt;

  return (
    <div className="p-4 border mt-4 bg-white">
      <h4 className="text-center mb-3">Medical Invoice</h4>

      <div className="mb-3">
        <strong>Customer Name:</strong> {customer.name} <br />
        <strong>Phone:</strong> {customer.phone}
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>₹{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 text-end">
        <p>
          <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
        </p>
        <p>
          <strong>Discount ({discount}%):</strong> ₹{discountAmt.toFixed(2)}
        </p>
        <p>
          <strong>VAT ({vat}%):</strong> ₹{vatAmt.toFixed(2)}
        </p>
        <h5>
          <strong>Grand Total:</strong> ₹{total.toFixed(2)}
        </h5>
      </div>
    </div>
  );
};

export default InvoicePreview;
