import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EvmRpcStatus.css';
import Header1 from './Header';

function EvmRpcStatus() {
  // Table column definitions
  const headers = [
    { key: "url",          label: "END POINT" },
    { key: "latestHeight", label: "LATEST_BLOCK" },
    { key: "syncing",      label: "CATCHING_UP" },
    { key: "peerCount",    label: "PEERS" },
    { key: "version",      label: "VERSION" },
  ];

  // React state
  const [rpcDetails, setRpcDetails] = useState([]);
  const [time1, setTime] = useState(); 
  const [copiedUrl, setCopiedUrl] = useState(null);

  // Sorting / filtering (not fully implemented, but placeholders)
  const [order, setOrder] = useState('ASC');
  const [sortedColumn, setSortedColumn] = useState(null);

  // If you want to filter by `version`, store it here
  const [selectedVersion, setSelectedVersion] = useState('');

  // Extract unique versions for button filters
  const versions = [...new Set(rpcDetails.map(detail => detail.version))]
    .filter(v => !!v); // remove any undefined/empty strings if present

  // Copy URL to clipboard
  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Fetch data on mount
  useEffect(() => {
    axios.get('https://bera-tools.brightlystake.com/api/bera/evm-rpc-status')
      .then(res => {
        setRpcDetails(res.data);
        // If there's at least 3 items, attempt to set time from the 3rd's timestamp
        if (res.data[2] && res.data[2].timestamp) {
          setTime(res.data[2].timestamp);
        }
      })
      .catch(err => {
        console.error("Error fetching RPC details:", err);
      });
  }, []);

  // Filter by selectedVersion (if not set, show all)
  const filteredDetails = rpcDetails.filter(detail => {
    if (!selectedVersion) return true;  // "Show All"
    return detail.version === selectedVersion;
  });

  return (
    <div className="table-container">
      <Header1 />
      <h2 className="header1">EVM RPC Status</h2>

      {/* Version filter buttons */}
      <div className="network-buttons">
        {versions.map(version => (
          <button
            key={version}
            onClick={() => setSelectedVersion(version)}
            className={selectedVersion === version ? 'active' : ''}
          >
            {version}
          </button>
        ))}
        <button
          onClick={() => setSelectedVersion('')}
          className={selectedVersion === '' ? 'active' : ''}
        >
          Show All
        </button>
      </div>

      {/* Table */}
      <table id="validators" key={`${selectedVersion}-${sortedColumn}-${order}`}>
        <thead>
          <tr className="header">
            {headers.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredDetails.map((val, idx) => (
            <tr key={`row-${idx}`}>
              {/* URL with tooltip for copying */}
              <td
                className="tooltip"
                onClick={() => handleCopyClick(val.url)}
              >
                {val.url}
                <span 
                  className={`tooltiptext ${copiedUrl === val.url ? 'copied' : ''}`}
                >
                  {copiedUrl === val.url ? 'Copied!' : 'Click to copy'}
                </span>
              </td>

              {/* LATEST_BLOCK */}
              <td>{val.latestHeight}</td>

              {/* CATCHING_UP => color green if "False", else normal */}
              <td className={val.syncing === 'False' ? 'green' : 'NO'}>
                {String(val.syncing).toUpperCase()}
              </td>

              {/* PEERS */}
              <td>{val.peerCount}</td>

              {/* VERSION */}
              <td>{val.version}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EvmRpcStatus;
