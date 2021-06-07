import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import AuthProvider from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import HUD from './components/HUD';

Modal.setAppElement('#root');

//@ts-ignore
// ReactDOM.createPortal(<HUD />, document.getElementById('hud'));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <ToastProvider
          autoDismiss
          autoDismissTimeout={2500}
          placement="bottom-right"
        >
          <AuthProvider>
            <ScrollToTop />
            <App />
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
