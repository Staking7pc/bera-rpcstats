import React from "react";
import "./Home.css";
export default function Cards() {
  return (
    <body>
      <div class="container">
        <div class="heading">
          <h4>Bera tools by <a href="https://brightlystake.com/">Brightlystake</a></h4>
        </div>
        
        <div class="row">
          <div class="card">
            <div class="card-header">
              <h3>RPC STATUS</h3>
            </div>
            <div class="card-body">
              <p>Check the status of beacond rpc in bera</p>
              <a target="_blank" rel="noopener noreferrer" href="/rpc-status" class="btn">
                Click here
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h3>SNAPSHOT</h3>
            </div>
            <div class="card-body">
              <p>Download the snapshot for bera testnet</p>
              <a target="_blank" rel="noopener noreferrer" href="https://testnet-berav2.brightlystake.com/snapshot/" class="btn">
                Click here
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h3>EVM RPC</h3>
            </div>
            <div class="card-body">
              <p>Check status of EVM endpoints for bera</p>
              <a target="_blank" rel="noopener noreferrer" href="/evm-rpc-status" class="btn">
                Click here
              </a>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h3>WSS</h3>
            </div>
            <div class="card-body">
              <p>Check status of EVM WSS endpoints for bera</p>
              <a target="_blank" rel="noopener noreferrer" href="/wss-status" class="btn">
                Click here
              </a>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
