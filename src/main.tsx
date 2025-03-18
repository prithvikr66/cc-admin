import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { PhantomWalletProvider } from './contexts/PhantomWallet';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PhantomWalletProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PhantomWalletProvider>
  </StrictMode>
);
