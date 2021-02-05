import axios from 'axios';

const client = axios.create();

//client.defaults.baseURL = `http://127.0.0.1:${(process.env.SERVER_PORT ? parseInt(JSON.parse(process.env.SERVER_PORT)) : 12001)}/`;
axios.defaults.withCredentials = true;

export default client;
