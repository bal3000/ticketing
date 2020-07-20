import React from 'react';
import axios from 'axios';

function LandingPage({ currentUser }) {
  console.log(currentUser);
  return <h1>Hello</h1>;
}

LandingPage.getInitialProps = async () => {
  const response = await axios.get(
    'http://auth-srv:3000/api/users/currentuser'
  );
  return response.data;
};

export default LandingPage;
