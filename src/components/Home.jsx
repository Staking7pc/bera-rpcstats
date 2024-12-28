import React from "react";
import "./Home.css";

export default function Cards() {
  return (
    <div className="container">
      <div className="heading">
        <h4>
          Bera tools by{" "}
          <a href="https://brightlystake.com/" target="_blank" rel="noopener noreferrer">
            Brightlystake
          </a>
        </h4>
      </div>

      <div className="row">
        <div className="card">
          <div className="card-header">
            <h3>RPC STATUS</h3>
          </div>
          <div className="card-body">
            <p>Check the status of beacond rpc in bera</p>
            <a href="/rpc-status" className="btn" target="_blank" rel="noopener noreferrer">
              Click here
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>SNAPSHOT</h3>
          </div>
          <div className="card-body">
            <p>Download the snapshot for bera testnet</p>
            <a
              href="https://testnet-berav2.brightlystake.com/snapshot/"
              className="btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Click here
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>EVM RPC</h3>
          </div>
          <div className="card-body">
            <p>Check status of EVM endpoints for bera</p>
            <a href="/evm-rpc-status" className="btn" target="_blank" rel="noopener noreferrer">
              Click here
            </a>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>WSS</h3>
          </div>
          <div className="card-body">
            <p>Check status of EVM WSS endpoints for bera</p>
            <a href="/wss-status" className="btn" target="_blank" rel="noopener noreferrer">
              Click here
            </a>
          </div>
        </div>

        {/* <div className="card">
          <div className="card-header">
            <h3>BLOCK REWARDS</h3>
          </div>
          <div className="card-body">
            <p>Check status of block rewards</p>
            <a href="/rewards-distribution" className="btn" target="_blank" rel="noopener noreferrer">
              Click here
            </a>
          </div>
        </div> */}
      </div>
    </div>
  );
}
