import React from 'react';
import Link from 'next/link';

function LandingPage({ currentUser, tickets }) {
  const ticketList = () => {
    return tickets.map((ticket) => (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a className="">View</a>
          </Link>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{ticketList()}</tbody>
      </table>
    </div>
  );
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  let tickets = [];
  try {
    const { data } = await client.get('/api/tickets');
    tickets = data;
  } catch (err) {
    console.error(err.response.data);
  }
  return { tickets };
};

export default LandingPage;
