import React, { useState } from "react";
import "../css/Dashboard.css";
import Sidebar from "./SideBar";
import {
  FaThermometerHalf,
  FaTint,
  FaSun,
  FaLightbulb,
  FaBars,
} from "react-icons/fa";
import { FaFan, FaRegSnowflake } from "react-icons/fa";
import { useEffect } from "react";
import DataChart from "./DataChart";
import { useSidebar } from "../contexts/SidebarContext";
const Dashboard = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [topLastSensor, setTopLastSensor] = useState([]);
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [light, setLight] = useState(0);
  // Trạng thái loading cho từng thiết bị
  const [loadingFan, setLoadingFan] = useState(false);
  const [loadingAC, setLoadingAC] = useState(false);
  const [loadingFridge, setLoadingFridge] = useState(false);

  // Trạng thái bật/tắt cho từng thiết bị
  const [isFanOn, setIsFanOn] = useState(false);
  const [isACOn, setIsACOn] = useState(false);
  const [isFridgeOn, setIsFridgeOn] = useState(false);
  const formatTime = (isoDate) => {
    const date = new Date(isoDate);

    // Chuyển đổi giờ về múi giờ Việt Nam (UTC+7)
    const vietnamOffset = 7 * 60; // UTC+7 tính bằng phút
    const localTime = new Date(date.getTime() + vietnamOffset * 60 * 1000);

    const hours = localTime.getUTCHours().toString().padStart(2, "0");
    const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
    const seconds = localTime.getUTCSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };
  const handleFanClick = async () => {
    const apiFan = `http://localhost:8000/api/v1/fan/status`;
    const state = isFanOn ? "off" : "on";
    setLoadingFan(true);

    try {
      const response = await fetch(apiFan, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      });
      const data = await response.json();

      if (response.ok) {
        // Xử lý dữ liệu phản hồi nếu cần
        console.log("Fan state changed successfully:", data);
        const stateStr = data.fanState;
        console.log(stateStr);

        const state = stateStr === "on" ? true : false;

        // Cập nhật trạng thái bật/tắt của quạt
        setIsFanOn(state);
        localStorage.setItem("isFanOn", stateStr);
      } else {
        console.error("Server error:", data);
      }
    } catch (error) {
      console.error("Failed to change Fan state", error);
    } finally {
      // Dừng loading sau khi nhận phản hồi từ server
      setTimeout(() => {
        setLoadingFan(false);
      }, 100);
    }
  };

  const handleACClick = async () => {
    const apiAC = `http://localhost:8000/api/v1/air/status`;
    const state = isACOn ? "off" : "on";
    setLoadingAC(true);

    try {
      const response = await fetch(apiAC, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      });
      const data = await response.json();

      if (response.ok) {
        // Xử lý dữ liệu phản hồi nếu cần
        console.log("Fan state changed successfully:", data);
        const stateStr = data.airState;
        const state = stateStr === "on" ? true : false;

        // Cập nhật trạng thái bật/tắt của quạt
        setIsACOn(state);
        localStorage.setItem("isACOn", stateStr);
      } else {
        console.error("Server error:", data);
      }
    } catch (error) {
      console.error("Failed to change Fan state", error);
    } finally {
      // Dừng loading sau khi nhận phản hồi từ server
      setTimeout(() => {
        setLoadingAC(false);
      }, 100);
    }
  };

  const handleFridgeClick = async () => {
    const apiLamp = `http://localhost:8000/api/v1/lamp/status`;
    const state = isFridgeOn ? "off" : "on";
    setLoadingFridge(true);

    try {
      const response = await fetch(apiLamp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state }),
      });
      const data = await response.json();

      if (response.ok) {
        // Xử lý dữ liệu phản hồi nếu cần
        console.log("Fan state changed successfully:", data);
        const stateStr = data.lampState;
        const state = stateStr === "on" ? true : false;

        // Cập nhật trạng thái bật/tắt của quạt
        setIsFridgeOn(state);
        localStorage.setItem("isFridgeOn", stateStr);
      } else {
        console.error("Server error:", data);
      }
    } catch (error) {
      console.error("Failed to change Fan state", error);
    } finally {
      // Dừng loading sau khi nhận phản hồi từ server
      setTimeout(() => {
        setLoadingFridge(false);
      }, 100);
    }
  };
  // Lấy dữ liệu từ API
  const apiGetLastSenSor = "http://localhost:8000/api/v1/top-last-sensor";
  const fetchData = async () => {
    const response = await fetch(apiGetLastSenSor);
    if (response.ok) {
      const data = await response.json();
      // Lưu và sắp xếp theo từ cũ đến mới
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      data.forEach((item) => {
        item.date = formatTime(item.date);
      });

      setTopLastSensor(data);
      setTemperature(data[data.length - 1].temperature);
      setHumidity(data[data.length - 1].humidity);
      setLight(data[data.length - 1].light);
    }
  };

  useEffect(() => {
    fetchData();
    // Thiết lập interval để gọi lại fetchData mỗi 30 giây
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // 30000ms = 30 giây
    if (localStorage.getItem("isFanOn") === "on") {
      setIsFanOn(true);
    }
    if (localStorage.getItem("isACOn") === "on") {
      setIsACOn(true);
    }
    if (localStorage.getItem("isFridgeOn") === "on") {
      setIsFridgeOn(true);
    }

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);
  // Tính toán màu sắc dựa trên dữ liệu
  const getTemperatureColor = (temp) => {
    const intensity = (temp - 15) / 2; // Điều chỉnh cường độ để nhạy cảm hơn
    return `linear-gradient(to bottom, rgba(255, 99, 71, ${
      intensity / 10
    }), rgba(255, 69, 0, ${intensity / 10}))`;
  };

  const getHumidityColor = (hum) => {
    const intensity = hum / 100; // Tính toán mức độ đậm nhạt
    return `linear-gradient(to bottom, rgba(0, 191, 255, ${intensity}), rgba(30, 144, 255, ${intensity}))`;
  };

  const getLightColor = (lux) => {
    const intensity = 1 - lux / 1050; // Tính toán mức độ đậm nhạt
    return `linear-gradient(to bottom, rgba(255, 215, 0, ${intensity}), rgba(255, 165, 0, ${intensity}))`;
  };

  const getLightTextColor = (lux) => {
    return lux > 512 ? "#000" : "#fff"; // Chọn màu chữ dựa trên độ sáng
  };

  return (
    <div id="main">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>
      {isSidebarOpen && <Sidebar />}
      <div className="dashboard">
        <div className="list-box-container">
          <h2 className="list-box-title">Thông số hiện tại</h2>
          <div className="list-box">
            <div
              className="box"
              style={{ background: getTemperatureColor(temperature) }}
            >
              <p>Nhiệt độ</p>
              <FaThermometerHalf className="box-icon" />
              <div className="box-value">{temperature}°C</div>
            </div>
            <div
              className="box"
              style={{ background: getHumidityColor(humidity) }}
            >
              <p>Độ ẩm</p>
              <FaTint className="box-icon" />
              <div className="box-value">{humidity}%</div>
            </div>
            <div
              className="box"
              style={{
                background: getLightColor(light),
                color: getLightTextColor(light),
              }}
            >
              <p>Ánh sáng</p>
              <FaSun className="box-icon" />
              <div className="box-value">{light} Lux</div>
            </div>
          </div>
        </div>
        <div className="dashboard-container">
          <div className="chart-section">
            <h2 className="chart-title">Biểu đồ 10 giá trị đo gần nhất</h2>
            <div className="chart-container">
              <DataChart data={topLastSensor} />
            </div>
          </div>
          <div className="control-panel">
            <h2 className="control-panel-title">Điều Chỉnh Thiết Bị Điện</h2>
            <table className="control-table">
              <thead>
                <tr>
                  <th>Thiết Bị</th>
                  <th>Điều Khiển</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="device-info">
                    <div className={`device-icon ${isFanOn ? "rotating" : ""}`}>
                      <FaFan className="icon" />
                    </div>
                    <span>Quạt</span>
                  </td>
                  <td>
                    <button
                      className={`control-button ${isFanOn ? "on" : "off"} ${
                        loadingFan ? "loading" : ""
                      }`}
                      onClick={handleFanClick}
                      disabled={loadingFan}
                    >
                      {loadingFan
                        ? "Loading..."
                        : isFanOn
                        ? "Tắt quạt"
                        : "Bật quạt"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="device-info">
                    <div
                      className={`device-icon ac-icon ${isACOn ? "on" : "off"}`}
                    >
                      <FaRegSnowflake className="icon" />
                    </div>
                    <span>Điều Hòa</span>
                  </td>
                  <td>
                    <button
                      className={`control-button ${isACOn ? "on" : "off"} ${
                        loadingAC ? "loading" : ""
                      }`}
                      onClick={handleACClick}
                      disabled={loadingAC}
                    >
                      {loadingAC
                        ? "Loading..."
                        : isACOn
                        ? "Tắt điều hòa"
                        : "Bật điều hòa"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="device-info">
                    <div
                      className={`device-icon fridge-icon ${
                        isFridgeOn ? "on" : "off"
                      }`}
                    >
                      <FaLightbulb className="icon" />
                    </div>
                    <span>Đèn</span>
                  </td>
                  <td>
                    <button
                      className={`control-button ${isFridgeOn ? "on" : "off"} ${
                        loadingFridge ? "loading" : ""
                      }`}
                      onClick={handleFridgeClick}
                      disabled={loadingFridge}
                    >
                      {loadingFridge
                        ? "Loading..."
                        : isFridgeOn
                        ? "Tắt đèn"
                        : "Bật đèn"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
