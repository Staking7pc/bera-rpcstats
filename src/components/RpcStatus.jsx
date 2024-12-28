import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RpcStatus.css';
import Header1 from './Header';

function RpcStatus() {
  // Column definitions
  const headers = [
    { key: "moniker", label: "MONIKER" },
    { key: "rpcUrl", label: "END POINT" },
    { key: "catchingUp", label: "CATCHING_UP" },
    { key: "indexer", label: "INDEXING" },
    { key: "earliestBlock", label: "EARLIEST_BLOCK" },
    { key: "version", label: "VERSION" },
    { key: "latestBlock", label: "LATEST_BLOCK" },
    { key: "network", label: "NETWORK" },
  ];

  // State
  const [rpcDetails, setRpcDetails] = useState([]);
  const [time1, setTime] = useState(); 
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null); // not currently used, but could be for sorting
  const [order, setOrder] = useState('ASC');              // likewise
  const [selectedNetwork, setSelectedNetwork] = useState('bartio-beacon-80084');

  // Extract unique networks from data
  const networks = [...new Set(rpcDetails.map(detail => detail.network))];

  // Handle copying the URL to clipboard
  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Fetch data on mount
  useEffect(() => {
    axios.get('https://bera-tools.brightlystake.com/api/bera/rpc-status')
      .then(res => {
        setRpcDetails(res.data);
        // Arbitrarily set time from the 3rd item if it exists
        if (res.data[2] && res.data[2].timestamp) {
          setTime(res.data[2].timestamp);
        }
      })
      .catch(err => {
        console.error("Error fetching RPC details:", err);
      });
  }, []);

  return (
    <div className="table-container">
      <div key={selectedNetwork}>
        <Header1 />
        <h2 className="header1">RPC Status</h2>

        {/* Network Buttons */}
        <div className="network-buttons">
          {networks.map((network) => (
            <button
              key={network}
              onClick={() => setSelectedNetwork(String(network))}
              className={selectedNetwork === String(network) ? 'active' : ''}
            >
              {
                network === 'None'      ? 'Not-reachable Endpoints' :
                network === 'mocha-4'   ? 'Testnet' :
                network === 'celestia'  ? 'Mainnet' : 
                network
              }
            </button>
          ))}
          <button onClick={() => setSelectedNetwork(null)}>
            Show All
          </button>
        </div>

        {/* Table */}
        <table 
          id="validators" 
          key={`${selectedNetwork}-${sortedColumn}-${order}`}
        >
          <thead>
            <tr className="header">
              {headers.map((row) => (
                <th key={row.key}>{row.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rpcDetails
              .filter(detail =>
                // If no network selected, show all; otherwise match the selected
                !selectedNetwork || String(detail.network) === String(selectedNetwork)
              )
              .map(val => {
                // Determine row class
                // 1) if moniker = "Brightlystake_rpc", highlight row
                // 2) if catchingUp != "False" OR latestBlock == "None", mark as "error"
                // 3) otherwise default ("NO")
                const rowClass =
                  val.moniker === "Brightlystake_rpc"
                    ? "decorate"
                    : (val.catchingUp !== "False" || val.latestBlock === "None")
                      ? "error"
                      : "NO";

                return (
                  <tr className={rowClass} key={val.moniker}>
                    {/* MONIKER */}
                    <td className="bold">
                      {String(val.moniker).toUpperCase()}
                    </td>

                    {/* RPC URL + Tooltip */}
                    <td 
                      className="tooltip"
                      onClick={() => handleCopyClick(val.rpcUrl)}
                    >
                      {val.rpcUrl}
                      <span
                        className={`tooltiptext ${copiedUrl === val.rpcUrl ? 'copied' : ''}`}
                      >
                        {copiedUrl === val.rpcUrl ? 'Copied!' : 'Click to copy'}
                      </span>
                    </td>

                    {/* CATCHING_UP */}
                    <td className={val.catchingUp === "False" ? "Active" : "InActive"}>
                      {val.catchingUp}
                    </td>

                    {/* INDEXER */}
                    <td className={val.indexer === "on" ? "green" : "NO"}>
                      {String(val.indexer).toUpperCase()}
                    </td>

                    {/* EARLIEST_BLOCK */}
                    <td>{val.earliestBlock}</td>

                    {/* VERSION */}
                    <td>{val.version}</td>

                    {/* LATEST_BLOCK */}
                    <td className={val.latestBlock === "None" ? "InActive" : "NO"}>
                      {val.latestBlock}
                    </td>

                    {/* NETWORK */}
                    <td className={val.network === "blockspacerace-0" ? "Active" : "InActive"}>
                      {val.network}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RpcStatus;
