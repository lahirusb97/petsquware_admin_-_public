// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const DashboardHome = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchPendingOrders = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5001/pets-square/us-central1/getPendingOrders"
//       );
//       console.log(response.data); // The data will be in response.data
//     } catch (error) {
//       console.error("Error fetching pending orders:", error);
//     }
//   };

//   useEffect(() => {
//     // fetchPendingOrders();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Pending Orders</h1>
//       <ul>
//         {orders.map((order) => (
//           <li key={order.id}>
//             <p>Order ID: {order.id}</p>
//             <p>Total: ${order.amount / 100}</p> {/* Amount is in cents */}
//             <p>Status: {order.status}</p>
//             {/* Display other order details as needed */}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DashboardHome;

import React from "react";

export default function DashboardHome() {
  return <div>Dashboar</div>;
}
