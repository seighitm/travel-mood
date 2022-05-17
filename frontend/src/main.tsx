import React from 'react';
import './index.css';
import './MapStyles.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import Providers from './components/common/engine/Providers';
import "regenerator-runtime/runtime";
import {createRoot} from 'react-dom/client';
import {io} from "socket.io-client";
import {SOCKET_ENDPOINT} from "./data/Constants";
import HelmetMetaData from "./components/common/SocialShare/HelmetMetaData";

const socket = io(SOCKET_ENDPOINT)

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
  <BrowserRouter>
    <HelmetMetaData/>
    <Providers>
      <App socketIo={socket}/>
    </Providers>
  </BrowserRouter>
);
