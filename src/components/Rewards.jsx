import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Header from './Header';
import './Rewards.css';

function Rewards() {
  // Table & pagination state
  const [tableData, setTableData] = useState([]); // raw data from server (up to 1000 rows per page)
  const [page, setPage] = useState(1);            // current page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filter: either null (Show All) or "undistributed" for rows with `timestamp === true`
  const [filter, setFilter] = useState(null);

  // Fetch data from the server
  const fetchData = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://bera-tools.brightlystake.com/api/bera/reward-status?page=${pageNumber}`);
      // Expecting { data, page, total_pages, page_size, total_rows }
      setTableData(res.data.data);      
      setTotalPages(res.data.total_pages);
      setPage(res.data.page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Fetch new data when `page` changes
  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Local filter for "Undistributed Rewards" → item.timestamp === true
  const filteredData = useMemo(() => {
    if (filter === 'undistributed') {
      return tableData.filter(item => item.timestamp === true);
    }
    // Otherwise show all rows from this page
    return tableData;
  }, [tableData, filter]);

  // Pagination handlers
  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="rewards-container">
      <Header />
      <h2 style={{ textAlign: 'center' }}>Rewards</h2>

      {/* Two Filter Buttons */}
      <div className="filters-container">
        <div
          className="filter-box"
          onClick={() => setFilter(null)} // Show all (no filter)
        >
          Show All
        </div>
        <div
          className="filter-box"
          onClick={() => setFilter('undistributed')}
        >
          Undistributed Rewards
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table id="validators1">
            <thead>
              <tr>
                <th>BLOCK NUMBER</th>
                <th>MINER</th>
                <th>REWARD STATUS</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((val, idx) => {
                // Example row or cell classes
                const rowClass = val.reward_status === "Failed" ? "error" : "";
                const rewardClass = String(val.reward_status).toLowerCase() === 'false'
                  ? 'green'
                  : 'InActive';

                return (
                  <tr className={rowClass} key={`row-${idx}`}>
                    <td>{val.block_number}</td>
                    <td>{val.miner}</td>
                    <td className={rewardClass}>{val.reward_status}</td>
                    <td>{String(val.timestamp)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-controls">
        <button onClick={handlePrevious} disabled={page <= 1}>
          Previous
        </button>
        <span className="page-info">
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Rewards;
