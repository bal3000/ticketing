import React, { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

function NewTicket() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'),
  });

  const titleChange = ({ target }) => {
    const { value } = target;
    setTitle(value);
  };

  const priceChange = ({ target }) => {
    const { value } = target;
    setPrice(value);
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={formSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={titleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={priceChange}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default NewTicket;
