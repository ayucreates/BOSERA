import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import axios from 'axios';

import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { store } from './store/store';
import './styles/index.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = API_URL;

console.log('API URL:', API_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);