import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WssStatus.css';
import Header1 from './Header';

function WssStatus(props) {

  const headers = [
    { key: "endpoint", label: "END POINT" },
    { key: "block", label: "LATEST_BLOCK" },
    { key: "status", label: "CONNECTION STATUS" },
    { key: "version", label: "VERSION" },
    { key: "peerCount", label: "PEERS" },
    { key: "timestamp", label: "LAST CHECKED" }
  ];

  const [rpcDetails, setRpcDetails] = useState([]);
  const [order, setOrder] = useState('ASC');
  const [time1, setTime] = useState(); // CamelCased
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  let networks = [...new Set(rpcDetails.map(detail => detail.network))];
  console.log(networks);

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  useEffect(() => {
    axios.get('https://bera-tools.brightlystake.com/api/bera/wss-status')
      .then(res => {
        const updatedData = res.data.map(detail => ({
          ...detail,
          block: parseInt(detail.block, 16) 
        }));
        setRpcDetails(updatedData);
        if (res.data[2] && res.data[2].updated_at) {
          setTime(res.data[2].updated_at);
        }
      })
      .catch(err => {
        console.error("Error fetching WSS details:", err);
      });
  }, []);

  return (
    <div className="table-container">
      <div>
        <Header1 />
        <div className="network-buttons">
          {networks.map(network => (
            <button
              key={network} // Ensure the key is unique
              onClick={() => setSelectedNetwork(String(network))}
              className={selectedNetwork === String(network) ? 'active' : ''}
            >
              Wss Endpoints
            </button>
          ))}
        </div>
        <table id='validators' key={`${selectedNetwork}-${sortedColumn}-${order}`}>
          <thead>
            <tr className='header'>
              {headers.map((row) => (
                <th key={row.key}>{row.label}</th> // Use <th> for headers
              ))}
            </tr>
          </thead>
          <tbody>
            {
              rpcDetails
                .filter(detail => selectedNetwork === "" || (selectedNetwork === 'Not-reachable Endpoints' && detail.network === "") || (selectedNetwork !== 'Not-reachable Endpoints' && String(detail.network) === String(selectedNetwork)))
                .map(val => (
                  <tr className={val.status === "Failed" ? "error" : 'NO'} key={val.endpoint}>
                    <td className="tooltip" onClick={() => handleCopyClick(val.endpoint)}>
                      {val.endpoint}
                      <span className={`tooltiptext ${copiedUrl === val.endpoint ? 'copied' : ''}`}>
                        {copiedUrl === val.endpoint ? 'Copied!' : 'Click to copy'}
                      </span>
                    </td>
                    <td>{val.block}</td>
                    <td className={val.status === 'Failed' ? 'InActive' : 'NO'}>{val.status}</td> 
                    <td>{val.version}</td>
                    <td>{val.peerCount}</td>
                    <td>{val.timestamp}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WssStatus;
