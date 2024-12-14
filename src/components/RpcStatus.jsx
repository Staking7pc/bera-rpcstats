import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RpcStatus.css';
import Header1 from './Header';
import Cards from './Cards';

function RpcStatus(props) {

  const headers = [
    { key: "moniker", label: "MONIKER" },
    { key: "rpcUrl", label: "END POINT" },
    { key: "catchingUp", label: "CATCHING_UP" },
    { key: "indexer", label: "INDEXING" },
    { key: "earliestBlock", label: "EARLIEST_BLOCK" },
    { key: "version", label: "VERSION" },
    { key: "latestBlock", label: "LATEST_BLOCK" },
    { key: "network", label: "NETWORK" },

    // { key: "timestamp", label: "CHECKED_ON (UTC)" }
  ];

  const [rpcDetails, setRpcDetails] = useState([]);
  const [order, setOrder] = useState('ASC');
  const [time1, setTime] = useState(); // CamelCased
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('bartio-beacon-80084');
  let networks = [...new Set(rpcDetails.map(detail => detail.network))];

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };


  useEffect(() => {
    axios.get('https://bera-tools.brightlystake.com/api/bera/rpc-status')
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
        <h2 className="header1">RPC Status </h2>
        <p></p>
        <div className="network-buttons">
          {networks.map(network => (
            <button
              key={network}
              onClick={() => setSelectedNetwork(String(network))}
              className={selectedNetwork === String(network) ? 'active' : ''}
            >
              {network == 'None' ? 'Not-reachable Endpoints' : network == 'mocha-4' ? 'Testnet':network == 'celestia' ? 'Mainnet':network}
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
                .filter(detail => !selectedNetwork || String(detail.network) === String(selectedNetwork))
                .map(val => {
                  return (
                    <tr className={(val.moniker === "Brightlystake_rpc") ? "decorate" : (val.catchingUp != "False") ? "error" : val.latestBlock == 'None' ? 'error' : 'NO'} key={val.moniker}>
                      <td className='bold'>{String(val.moniker).toUpperCase()}</td>
                      <td className="tooltip" onClick={() => handleCopyClick(val.rpcUrl)}>
                        {val.rpcUrl}
                        <span className={`tooltiptext ${copiedUrl === val.rpcUrl ? 'copied' : ''}`}>
                          {copiedUrl === val.rpcUrl ? 'Copied!' : 'Click to copy'}
                        </span>
                      </td>
                      <td className={val.catchingUp === "False" ? "Active" : "InActive"}>{val.catchingUp}</td>
                      <td className={val.indexer == 'on' ? 'green' : 'NO'}>{String(val.indexer).toUpperCase()}</td>
                      <td>{val.earliestBlock}</td>
                      <td>{val.version}</td>
                      <td className={val.latestBlock == 'None' ? 'InActive' : 'NO'}>{val.latestBlock}</td>
                      <td className={val.network === "blockspacerace-0" ? "Active" : "InActive"}>{val.network}</td>
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

export default RpcStatus

