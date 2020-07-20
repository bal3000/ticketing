import React from 'react';

import buildClient from '../api/build-client';

function LandingPage({ currentUser }) {
  const { email } = currentUser;
  return <h1>Hello {email}</h1>;
}

LandingPage.getInitialProps = async (context) => {
  const client = await buildClient(context);
  const { data } = client.get('/api/users/currentuser');
  return data;
};

export default LandingPage;
