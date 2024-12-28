import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WssStatus.css';
import Header1 from './Header';

function WssStatus() {
  // Table column definitions
  const headers = [
    { key: "endpoint", label: "END POINT" },
    { key: "block", label: "LATEST_BLOCK" },
    { key: "status", label: "CONNECTION STATUS" },
    { key: "version", label: "VERSION" },
    { key: "peerCount", label: "PEERS" },
    { key: "timestamp", label: "LAST CHECKED" }
  ];

  // React state
  const [rpcDetails, setRpcDetails] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Extract unique networks for buttons
  const networks = [...new Set(rpcDetails.map(detail => detail.network))]
    .filter(net => !!net); // Filter out empty strings if you want

  // Handle copy-to-clipboard
  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Fetch data on mount
  useEffect(() => {
    axios.get('https://bera-tools.brightlystake.com/api/bera/wss-status')
      .then(res => {
        // Convert 'block' from hex to decimal
        const updatedData = res.data.map(detail => ({
          ...detail,
          block: detail.block ? parseInt(detail.block, 16) : detail.block
        }));
        setRpcDetails(updatedData);
      })
      .catch(err => {
        console.error("Error fetching WSS details:", err);
      });
  }, []);

  // Filter logic
  // If `selectedNetwork` is empty => show all
  // Otherwise show only rows that match the `selectedNetwork`
  const filteredData = rpcDetails.filter(detail => {
    if (!selectedNetwork) return true; // show all
    return String(detail.network) === String(selectedNetwork);
  });

  return (
    <div className="table-container">
      <Header1 />

      {/* Network selection buttons */}
      <div className="network-buttons">
        {networks.map(network => (
          <button
            key={network}
            onClick={() => setSelectedNetwork(String(network))}
            className={selectedNetwork === String(network) ? 'active' : ''}
          >
            {network || 'Unknown Network'}
          </button>
        ))}
        {/* Show All button */}
        <button
          onClick={() => setSelectedNetwork('')}
          className={selectedNetwork === '' ? 'active' : ''}
        >
          Show All
        </button>
      </div>

      <table id="validators">
        <thead>
          <tr className="header">
            {headers.map((row) => (
              <th key={row.key}>{row.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map(val => {
            // Row styling: if status is "Failed", highlight the row
            const rowClass = val.status === "Failed" ? "error" : "NO";

            return (
              <tr className={rowClass} key={val.endpoint}>
                {/* Endpoint with tooltip copy */}
                <td className="tooltip" onClick={() => handleCopyClick(val.endpoint)}>
                  {val.endpoint}
                  <span className={`tooltiptext ${copiedUrl === val.endpoint ? 'copied' : ''}`}>
                    {copiedUrl === val.endpoint ? 'Copied!' : 'Click to copy'}
                  </span>
                </td>
                {/* Latest Block (decimal, from parseInt) */}
                <td>{val.block}</td>
                {/* Connection Status */}
                <td className={val.status === "Failed" ? "InActive" : "NO"}>
                  {val.status}
                </td>
                {/* Version */}
                <td>{val.version}</td>
                {/* Peers */}
                <td>{val.peerCount}</td>
                {/* Timestamp */}
                <td>{val.timestamp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WssStatus;
