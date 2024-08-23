import React, { useState, useEffect } from "react";
import "../css/DataSensor.css";
import Sidebar from "./SideBar";
import { FaBars } from "react-icons/fa";
import { useSidebar } from "../contexts/SidebarContext";
import moment from "moment-timezone";

const DataSensor = () => {
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [typeSort, setTypeSort] = useState("asc");
  const formatDateToVietnamTimezone = (dateString) => {
    const vietnamTimezone = "Asia/Ho_Chi_Minh";
    const formattedDate = moment(dateString)
      .tz(vietnamTimezone)
      .format("DD/MM/YYYY HH:mm:ss");
    return formattedDate;
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/sensors?page=${page}&keyword=${searchTerm}&searchBy=${searchField}&startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&typeSort=${typeSort}`
      );
      const result = await response.json();
      setData(result.results);
      setTotalPages(result.totalPages);
      setIsDataEmpty(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsDataEmpty(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sortBy, typeSort]);

  const handleSearch = () => {
    setPage(1);
    fetchData();
  };

  const handleSort = (field) => {
    const newTypeSort = sortBy === field && typeSort === "asc" ? "desc" : "asc";
    setSortBy(field);
    setTypeSort(newTypeSort);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (totalPages > 5) {
      if (page <= 3) {
        end = Math.min(5, totalPages);
      } else if (page >= totalPages - 2) {
        start = Math.max(totalPages - 4, 1);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };
  if (isDataEmpty) {
    return (
      <div id="main">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        {isSidebarOpen && (
          <Sidebar className={`sidebar ${isSidebarOpen ? "" : "closed"}`} />
        )}
        <div className="sensor-table-container">
          <h1>Data Sensor</h1>
          <p>Không có dữ liệu, vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }
  return (
    <div id="main">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      {isSidebarOpen && (
        <Sidebar className={`sidebar ${isSidebarOpen ? "" : "closed"}`} />
      )}
      <div className="sensor-table-container">
        <h1>Data Sensor</h1>
        <div className="search-container">
          <div className="data-search">
            <div className="search-items">
              <div>
                <label htmlFor="searchTerm">Tìm kiếm:</label>
                <input
                  id="searchTerm"
                  type="text"
                  placeholder="Tìm kiếm theo thông số"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="searchField">Tìm kiếm theo:</label>
                <select
                  id="searchField"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="temperature">Nhiệt độ</option>
                  <option value="humidity">Độ ẩm</option>
                  <option value="light">Ánh sáng</option>
                </select>
              </div>
            </div>
            <div className="search-items">
              <div>
                <label htmlFor="startDate">Bắt đầu:</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="endDate">Kết thúc:</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button onClick={handleSearch}>Tìm kiếm</button>
        </div>
        <table className="sensor-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>ID</th>
              <th onClick={() => handleSort("temperature")}>
                Nhiệt độ{" "}
                {sortBy === "temperature" && (typeSort === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("humidity")}>
                Độ ẩm{" "}
                {sortBy === "humidity" && (typeSort === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("light")}>
                Ánh sáng{" "}
                {sortBy === "light" && (typeSort === "asc" ? "▲" : "▼")}
              </th>
              <th onClick={() => handleSort("date")}>
                Date {sortBy === "date" && (typeSort === "asc" ? "▲" : "▼")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((sensor, index) => (
              <tr key={sensor.id}>
                <td>{index}</td>
                <td>{sensor.id}</td>
                <td>{sensor.temperature}°C</td>
                <td>{sensor.humidity}%</td>
                <td>{sensor.light} Lux</td>
                <td>{formatDateToVietnamTimezone(sensor.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(1)}>
            First
          </button>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          {generatePageNumbers().map((p) => (
            <button
              key={p}
              className={p === page ? "active" : ""}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSensor;
