import React from 'react';

function LandingPage({ currentUser, tickets }) {
  const ticketList = () => {
    return tickets.map((ticket) => (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    ));
  };

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList()}</tbody>
      </table>
    </div>
  );
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data: tickets } = await client.get('/api/tickets');
  return { tickets };
};

export default LandingPage;
