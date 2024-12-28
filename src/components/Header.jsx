import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="header-nav">
      <ul>
        {/* "Brand" or logo link on the far left */}
        <li className="brand">
          <a href="https://brightlystake.com">Brightlystake</a>
        </li>
        {/* Nav links (float-like behavior handled by flexbox) */}
        <li>
          <a className="active" href="/rpc-status">
            RPC
          </a>
        </li>
        <li>
          <a className="active" href="/evm-rpc-status">
            EVM-RPC
          </a>
        </li>
        <li>
          <a className="active" href="/wss-status">
            WSS
          </a>
        </li>
        <li>
          <a className="active" href="/rewards-distribution">
            REWARDS
          </a>
        </li>
        <li>
          <a className="active" href="/">
            HOME
          </a>
        </li>
      </ul>
    </header>
  );
}
