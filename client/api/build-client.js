import axios from 'axios';

const buildClient = ({ req }) => {
  let baseURL = '/';
  let headers = null;
  if (typeof window === 'undefined') {
    // we are on the server
    baseURL = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
    headers = req.headers;
  }

  return axios.create({ baseURL, headers });
};

export default buildClient;
