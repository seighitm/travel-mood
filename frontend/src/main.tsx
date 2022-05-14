import React from 'react';
import './index.css';
import './MapStyles.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import Providers from './components/common/engine/Providers';
import "regenerator-runtime/runtime";
import {createRoot} from 'react-dom/client';

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <BrowserRouter>
    <Providers>
      <App/>
    </Providers>
  </BrowserRouter>
);
