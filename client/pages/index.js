import React from 'react';

function LandingPage({ currentUser }) {
  return <h1>{currentUser ? 'You are signed in!' : 'You are signed out!'}</h1>;
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
