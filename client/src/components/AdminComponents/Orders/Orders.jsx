import React from "react";

const Orders = () => {
  // Replace with API data
  const orders = [
    { id: 1, customer: "John Doe", total: "$50", status: "Shipped" },
    { id: 2, customer: "Jane Smith", total: "$30", status: "Pending" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Orders</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Order ID</th>
            <th className="border border-gray-300 px-4 py-2">Customer</th>
            <th className="border border-gray-300 px-4 py-2">Total</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border border-gray-300 px-4 py-2">{order.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {order.customer}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.total}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
