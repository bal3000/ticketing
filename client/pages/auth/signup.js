import React, { useState } from 'react';
import axios from 'axios';
import useRequest from '../../hooks/use-request';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
  });

  const emailChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  const passwordChange = ({ target }) => {
    const { value } = target;
    setPassword(value);
  };

  const formSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <form onSubmit={formSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input value={email} onChange={emailChange} className="form-control" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={passwordChange}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
}

export default SignUp;
