import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const client = new QueryClient();

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

// ------------------------
// YOU CAN IGNORE THIS FILE
// ------------------------
