import React from 'react';

function Orders({ orders }) {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  );
}

Orders.getInitialProps = async (context, client) => {
  const { data: orders } = await client.get('/api/orders');

  return { orders };
};

export default Orders;
