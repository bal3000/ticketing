import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

function AppComponent({ Component, pageProps }) {
  return (
    <div>
      <Header currentUser={pageProps.currentUser} />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

AppComponent.getInitialProps = async ({ ctx, Component }) => {
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser);
  }

  pageProps = { ...pageProps, ...data };

  return { pageProps };
};

export default AppComponent;
