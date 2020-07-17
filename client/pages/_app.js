import 'bootstrap/dist/css/bootstrap.css';

const AppComponentWrapper = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default AppComponentWrapper;
