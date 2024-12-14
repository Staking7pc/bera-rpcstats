import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Seed.css";
import Header1 from "./Header";

function RpcStatus(props) {
  const headers = [
    { key: "endpoint", label: "END POINT" },
    { key: "lastHeight", label: "LAST HEIGHT" },
  ];

  const [rpcDetails, setRpcDetails] = useState([]);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleCopyClick = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  useEffect(() => {
    axios
      .get("https://crossfi-tools.brightlystake.com/api/crossfi/indexer-status")
      .then((res) => {
        setRpcDetails(res.data);
      })
      .catch((err) => {
        console.error("Error fetching RPC details:", err);
        // Optionally, you can set some error state to show an error to the user
      });
  }, []);

  return (
    <div className="table-container">
      <div>
        <Header1 />
        <p></p>
        <h2 className="header1">Seeds/Peers Status </h2>
        <p className="header1">
          We gather the endpoints every 10 minutes from{" "}
          <a href="https://github.com/anoma/crossfi-shielded-expedition/tree/main?tab=readme-ov-file">
            {" "}
            link
          </a>{" "}
          and check the lastest height from url/block/last every 5 minutes
        </p>
        <table id="validators">
          <thead>
            <tr className="header">
              {headers.map((row) => {
                return <td>{row.label}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {rpcDetails.map((val) => {
              var className1="Active", difference=0, highestHeight=0
              var heights = rpcDetails
                .map((val) => parseInt(val.lastHeight))
                .filter((height) => !isNaN(height) && height !== null);

              if (heights.length > 0) {
                var highestHeight = Math.max(...heights);
                console.log(highestHeight)
              }

              return (
                <tr key={val.moniker}>
                  <td
                    className="tooltip"
                    onClick={() => handleCopyClick(val.endpoint)}
                  >
                    {val.endpoint}
                    <span
                      className={`tooltiptext ${
                        copiedUrl === val.endpoint ? "copied" : ""
                      }`}
                    >
                      {copiedUrl === val.endpoint ? "Copied!" : "Click to copy"}
                    </span>
                  </td>
                  <td className={(highestHeight-val.lastHeight < 3)?'highlight':'InActive' }>
                    {val.lastHeight}
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
