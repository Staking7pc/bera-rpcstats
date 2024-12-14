import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './components/Home';
import RpcStatus from "./components/RpcStatus";
import EvmRpcStatus from "./components/EvmRpcStatus";
import WssStatus from "./components/WssStatus";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>

  <Router>
    <React.Fragment>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/rpc-status" element={<RpcStatus/>} />
        <Route path="/evm-rpc-status" element={<EvmRpcStatus/>} />
        <Route path="/wss-status" element={<WssStatus/>} />

        {/* <Route path="/seed-peer-status" element={<Seed/>} />
        <Route path="/self-test" element={<APIStatus/>} />
        <Route path="/indexer-status" element={<Indexer/>} />      
        <Route path="/faucet" element={<Faucet/>} />       */}

      </Routes>
    </React.Fragment>
  </Router>

);
