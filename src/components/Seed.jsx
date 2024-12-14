import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Seed.css";
import Header1 from "./Header";

function RpcStatus(props) {
  const headers = [
    { key: "moniker", label: "MONIKER" },
    { key: "endpoint", label: "END POINT" },
    { key: "status", label: "STATUS" },
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
      .get("https://crossfi-tools.brightlystake.com/api/crossfi/seed-peer-status")
      .then((res) => {
        setRpcDetails(res.data);
      })
      .catch((err) => {
        console.error("Error fetching RPC details:", err);
        // Optionally, you can set some error state to show an error to the user
      });
  }, []);

  const upEndpoints = rpcDetails
    .filter((detail) => detail.status === "up")
    .map((detail) => detail.endpoint);

  return (
    <div className="table-container">
      <div>
        <Header1 />
        <p></p>
        <h2 className="header1">Seeds/Peers Status </h2>
        <p className="header1">We gather the endpoints every 10 minutes from <a href="https://github.com/anoma/crossfi-shielded-expedition/tree/main?tab=readme-ov-file"> link </a> and check for the status using <a href="https://github.com/strangelove-ventures/tmp2p/tree/main">tmp2p</a> every 5 minutes</p>
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
              return (
                <tr
                  className={val.status != "up" ? "error" : ""}
                  key={val.moniker}
                >
                  <td className="bold">{String(val.moniker).toUpperCase()}</td>
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
                  <td className={val.status === "up" ? "Active" : "InActive"}>
                    {val.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2 className="header1"> Inspired from <a href="https://github.com/strangelove-ventures/tmp2p/tree/main"> tmp2p</a> </h2>
      </div>
    </div>
  );
}

export default RpcStatus;
