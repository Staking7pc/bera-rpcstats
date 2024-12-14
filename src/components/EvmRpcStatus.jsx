import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EvmRpcStatus.css';
import Header1 from './Header';

function EvmRpcStatus(props) {

  const headers = [
    { key: "url", label: "END POINT" },
    { key: "latestHeight", label: "LATEST_BLOCK" },
    { key: "syncing", label: "CATCHING_UP" },
    { key: "peerCount", label: "PEERS" },
    { key: "version", label: "VERSION" },
  ];

  const [rpcDetails, setRpcDetails] = useState([]);
  const [order, setOrder] = useState('ASC');
  const [time1, setTime] = useState(); // CamelCased
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  let networks = [...new Set(rpcDetails.map(detail => detail.version))];

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };


  useEffect(() => {
    axios.get('https://bera-tools.brightlystake.com/api/bera/evm-rpc-status')
      .then(res => {
        setRpcDetails(res.data);
        setTime(res.data[2].timestamp); // Renamed to setTime
      })
      .catch(err => {
        console.error("Error fetching RPC details:", err);
        // Optionally, you can set some error state to show an error to the user
      });
  }, []);

  return (
    <div className="table-container">

      <div key={selectedNetwork}>
        <Header1 />
        <h2 className="header1">EVM RPC Status </h2>
        <p></p>
        <div className="network-buttons">
          {networks.map(network => (
            <button
              key={network}
              onClick={() => setSelectedNetwork(String(network))}
              className={selectedNetwork === String(network) ? 'active' : ''}
            >
              {network}
            </button>

          ))}
          <button onClick={() => setSelectedNetwork(null)}>Show All</button>
         
        </div>
        <table id='validators' key={`${selectedNetwork}-${sortedColumn}-${order}`}>

          <thead>
            <tr className='header'>
              {headers.map((row) => {
                return <td>{row.label}</td>
              })}
            </tr>
          </thead>
          <tbody>
            {
              rpcDetails
                .filter(detail => !selectedNetwork || String(detail.network) == String(selectedNetwork)) 
                .map(val => {
                  return (
                    <tr>
                      <td className="tooltip" onClick={() => handleCopyClick(val.url)}>
                        {val.url}
                        <span className={`tooltiptext ${copiedUrl === val.url ? 'copied' : ''}`}>
                          {copiedUrl === val.url ? 'Copied!' : 'Click to copy'}
                        </span>
                      </td>

                      <td>{val.latestHeight}</td>
                      <td className={val.syncing == 'False' ? 'green' : 'NO'}>{String(val.syncing).toUpperCase()}</td>
                      <td>{val.peerCount}</td>
                      <td>{val.version}</td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default EvmRpcStatus

