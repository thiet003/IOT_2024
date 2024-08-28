import React, { useState } from "react";
import Sidebar from "./SideBar";
import "../css/ActionHistory.css";
import { FaBars } from "react-icons/fa";
import { useSidebar } from "../contexts/SidebarContext";
import { useEffect } from "react";

const ActionHistory = () => {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
  };

  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [actions, setActions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchActions = async () => {
    const limit = 10;
    const api = `http://localhost:8000/api/v1/history-action?startDate=${startDate}&endDate=${endDate}&sensorName=${sensorName}&page=${currentPage}&limit=${limit}`;
    const response = await fetch(api);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      
      setActions(data.actions);
      setTotalPages(data.totalPages);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchActions();
  };

  useEffect(() => {
    document.title = 'Action History';
    fetchActions();
  }, [currentPage, sensorName]);

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSelect = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageSelect(i)}
          className={`page-button ${i === currentPage ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div id="main">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      {isSidebarOpen && (
        <Sidebar className={`sidebar ${isSidebarOpen ? "" : "closed"}`} />
      )}
      <div className="action-history-content">
        <h1>Action History</h1>
        <div className="search-controls">
          <div className="search-row">
            <div className="search-item">
              <label htmlFor="startDate">Ngày bắt đầu:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="search-item">
              <label htmlFor="endDate">Ngày kết thúc:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="search-item">
              <button onClick={handleSearch}>Tìm kiếm</button>
            </div>
          </div>
          <div className="search-row">
            <div className="search-item">
              <label htmlFor="sensorName">Tên thiết bị:</label>
              <select
                id="sensorName"
                value={sensorName}
                onChange={(e) => setSensorName(e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="Quạt">Quạt</option>
                <option value="Điều hòa">Điều hòa</option>
                <option value="Đèn">Đèn</option>
              </select>
            </div>
          </div>
        </div>
        <div className="action-table">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>ID</th>
                <th>Thiết bị</th>
                <th>Hành động</th>
                <th>Ngày thực hiện</th>
                <th>Giờ thực hiện</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action, index) => (
                <tr key={action.action_id}>
                  <td>{index + 1 + (currentPage - 1) * 10}</td>
                  <td>{action.action_id}</td>
                  <td>{action.sensorName}</td>
                  <td>{action.action}</td>
                  <td>{formatDate(action.date)}</td>
                  <td>{formatTime(action.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button onClick={handleFirstPage} disabled={currentPage === 1}>
            First
          </button>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionHistory;
