import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';

import useRequest from '../../hooks/use-request';

function OrderDetails({ order, currentUser }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const timeLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(timeLeft / 1000));
    };
    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      {timeLeft < 0 ? (
        <div>Order Expired</div>
      ) : (
        <React.Fragment>
          <div>Time left to pay: {timeLeft} seconds</div>
          <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51HEsXDH5CPmGUOobhLejiauwUbile5hPeBYSBaiLFGaDTlpUvmPrjJSUEF9ZAPbfe3OvDVsIWbqbqbR6261afsPe00Ab72rAW9"
            amount={order.ticket.price * 100}
            currency="GBP"
            email={currentUser.email}
          />
          {errors}
        </React.Fragment>
      )}
    </div>
  );
}

OrderDetails.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data: order } = await client.get(`/api/orders/${orderId}`);
  return { order };
};

export default OrderDetails;
