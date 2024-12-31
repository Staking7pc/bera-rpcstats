import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Status.css";
import Header from './Header';

function Status() {
  const [blocks, setBlocks] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highestBlk, setHighestBlk] = useState(null);
  const [miners, setMiners] = useState([]);
  const [validators, setValidators] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const [selectedMiner, setSelectedMiner] = useState("");
  const [selectedValidator, setSelectedValidator] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  const TOTAL_BLOCKS = 8500;

  useEffect(() => {
    const fetchAndGenerateBlocks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://bera-tools.brightlystake.com/api/bera/reward-status"
        );
        const apiData = response.data.data;

        if (!apiData || apiData.length === 0) {
          // Handle case when API returns no data
          // Assuming block_number starts at 0 if no data
          const defaultBlocks = generateDefaultBlocks(TOTAL_BLOCKS, 0);
          setBlocks(defaultBlocks);
          setFilteredBlocks(defaultBlocks);
          setHighestBlk(0);
          setMiners([]);
          setValidators([]);
          return;
        }

        // Find the highest block_number from the API data
        const highestBlockNumber = Math.max(
          ...apiData.map((item) => item.block_number)
        );
        setHighestBlk(highestBlockNumber);

        // Extract unique miners for the dropdown
        const uniqueMiners = [
          ...new Set(apiData.map((item) => item.miner).filter(Boolean)),
        ];
        setMiners(uniqueMiners);

        // Extract unique validators for the dropdown
        const uniqueValidators = [
          ...new Set(apiData.map((item) => item.validator).filter(Boolean)),
        ];
        setValidators(uniqueValidators);

        // Create a map for quick lookup of reward_status, miner, validator by block_number
        const blockDataMap = {};
        apiData.forEach((item) => {
          blockDataMap[item.block_number] = {
            reward_status: item.reward_status,
            miner: item.miner || "Unknown",
            validator: item.validator || "Unknown",
          };
        });

        // Generate 8500 blocks starting from the highest block_number
        const generatedBlocks = [];
        for (let i = 0; i < TOTAL_BLOCKS; i++) {
          const currentBlockNumber = highestBlockNumber - i;
          const blockInfo = blockDataMap[currentBlockNumber];

          generatedBlocks.push({
            block_number: currentBlockNumber,
            reward_status: blockInfo ? blockInfo.reward_status : "default", 
            miner: blockInfo ? blockInfo.miner : "Unknown",
            validator: blockInfo ? blockInfo.validator : "Unknown",
          });
        }

        setBlocks(generatedBlocks);
        setFilteredBlocks(generatedBlocks);
      } catch (error) {
        console.error("Error fetching data:", error);
        // In case of error, still generate default blocks
        // Assuming block_number starts at 0 if error occurs
        const defaultBlocks = generateDefaultBlocks(TOTAL_BLOCKS, 0);
        setBlocks(defaultBlocks);
        setFilteredBlocks(defaultBlocks);
        setHighestBlk(0);
        setMiners([]);
        setValidators([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateBlocks();
  }, [refreshCounter]); // Depend on refreshCounter to trigger re-fetch

  // Helper function to generate default blocks with grey color
  const generateDefaultBlocks = (count, startingBlockNumber) => {
    const defaultBlocks = [];
    for (let i = 0; i < count; i++) {
      defaultBlocks.push({
        block_number: startingBlockNumber - i,
        reward_status: "default",
        miner: "Unknown",
        validator: "Unknown",
      });
    }
    return defaultBlocks;
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();

    let filtered = blocks;

    // Textbox for miner
    if (filterInput.trim() !== "") {
      filtered = filtered.filter((block) =>
        block.miner.toLowerCase().includes(filterInput.trim().toLowerCase())
      );
    }

    // Dropdown for miner
    if (selectedMiner !== "") {
      filtered = filtered.filter((block) => block.miner === selectedMiner);
    }

    // Dropdown for validator
    if (selectedValidator !== "") {
      filtered = filtered.filter((block) => block.validator === selectedValidator);
    }

    setFilteredBlocks(filtered);
  };

  const handleReset = () => {
    setFilterInput("");
    setSelectedMiner("");
    setSelectedValidator("");
    setFilteredBlocks(blocks);
  };

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  // On click of any block => filter by that block's validator
  const handleBlockClick = (validator) => {
    setSelectedValidator(validator); 
    // Perform the same filtering logic but only by validator here
    if (validator === "Unknown") {
      // If the validator is unknown, you can decide how you want to handle it
      setFilteredBlocks(blocks.filter((block) => block.validator === "Unknown"));
    } else {
      setFilteredBlocks(blocks.filter((block) => block.validator === validator));
    }
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="reward-status-grid-container">
      <Header/>
      <h1 className="page-title">
        Status of payment for 8500 blocks before {highestBlk}
      </h1>

      <form className="filter-form" onSubmit={handleFilterSubmit}>
        <div className="filter-group">
          <label htmlFor="miner-input">Filter by Miner (Textbox):</label>
          <input
            type="text"
            id="miner-input"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            placeholder="Enter miner name"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="miner-select">Filter by Miner (Dropdown):</label>
          <select
            id="miner-select"
            value={selectedMiner}
            onChange={(e) => setSelectedMiner(e.target.value)}
          >
            <option value="">--Select Miner--</option>
            {miners.map((miner, index) => (
              <option key={index} value={miner}>
                {miner}
              </option>
            ))}
          </select>
        </div>

        {/* New Dropdown for Validator */}
        <div className="filter-group">
          <label htmlFor="validator-select">Filter by Validator (Dropdown):</label>
          <select
            id="validator-select"
            value={selectedValidator}
            onChange={(e) => setSelectedValidator(e.target.value)}
          >
            <option value="">--Select Validator--</option>
            {validators.map((validator, index) => (
              <option key={index} value={validator}>
                {validator}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <button type="button" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </form>

      <div className="block-grid">
        {filteredBlocks.map((block, index) => {
          let blockClass = "block-grey"; // Default color

          if (block.reward_status === "true") {
            blockClass = "block-red";
          } else if (block.reward_status === "false") {
            blockClass = "block-green";
          }

          return (
            <div
              key={index}
              className={`block tooltip ${blockClass}`}
              onClick={() => handleBlockClick(block.validator)} 
            >
              <div className="tooltip-text">
                <strong>Status:</strong>{" "}
                {block.reward_status === "default"
                  ? "N/A"
                  : block.reward_status}
                <br />
                <strong>Block No:</strong> {block.block_number}
                <br />
                <strong>Miner:</strong> {block.miner}
                <br />
                {/* Show validator in the tooltip */}
                <strong>Validator:</strong> {block.validator}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Status;
