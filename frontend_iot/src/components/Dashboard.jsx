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
      console.log(data);
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
    }, 1000); // 1000ms = 1 giây
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
  // Chuyển đổi màu sắc dựa trên giá trị nhiệt độ
  const getTemperatureColor = (temp) => {
    // Đảm bảo giá trị nhiệt độ nằm trong khoảng 20 đến 40
    const clampedTemp = Math.max(20, Math.min(temp, 40));
    
    // Tính toán tỷ lệ dựa trên nhiệt độ
    const ratio = (clampedTemp - 20) / (40 - 20);

    // Màu sắc cho các ngưỡng nhiệt độ
    const startColor = { r: 255, g: 255, b: 0 }; // Vàng
    const midColor = { r: 255, g: 165, b: 0 };   // Cam
    const endColor = { r: 255, g: 0, b: 0 };     // Đỏ

    // Tính toán màu sắc cho gradient
    let color1, color2;
    let mixRatio = ratio * 2;
    if (ratio < 0.5) {
        // Chuyển từ vàng sang cam
        mixRatio = ratio * 2;
        color1 = startColor;
        color2 = midColor;
    } else {
        // Chuyển từ cam sang đỏ
        mixRatio = (ratio - 0.5) * 2;
        color1 = midColor;
        color2 = endColor;
    }

    // Tính toán màu cuối cùng
    const r = Math.round(color1.r * (1 - mixRatio) + color2.r * mixRatio);
    const g = Math.round(color1.g * (1 - mixRatio) + color2.g * mixRatio);
    const b = Math.round(color1.b * (1 - mixRatio) + color2.b * mixRatio);

    // Tránh gradient quá trắng bằng cách sử dụng alpha thấp hơn và kiểm soát độ sáng
    return `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, 1), rgba(${r}, ${g}, ${b}, 0.8))`;
};
  // Chuyển đổi màu sắc dựa trên giá trị độ ẩm
  const getHumidityColor = (hum) => {
    // Đảm bảo giá trị hum nằm trong khoảng hợp lý (0 đến 100)
    const clampedHum = Math.min(Math.max(hum, 0), 100);
    
    // Normalize humidity to be between 0 and 1
    // Chuyển đổi cường độ độ ẩm từ 0 đến 100 thành tỷ lệ từ 0 đến 1
    const normalizedHum = (clampedHum - 50) / 50; // Normalize range from 50 to 100
    
    // Màu sắc từ xanh nhạt đến xanh đậm
    const startColor = { r: 0, g: 191, b: 255 }; // Xanh nhạt
    const endColor = { r: 30, g: 144, b: 255 };  // Xanh đậm
    
    // Tính toán màu trung gian dựa trên giá trị normalizedHum
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * normalizedHum);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * normalizedHum);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * normalizedHum);

    // Để đảm bảo màu sắc rõ ràng hơn trong khoảng 50 đến 100, không cần linear-gradient, chỉ một màu sắc.
    return `rgb(${r}, ${g}, ${b})`;
};
// Chuyển đổi màu sắc dựa trên giá trị ánh sáng
  const getLightColor = (light) => {
    // Đảm bảo giá trị ánh sáng nằm trong khoảng 0 đến 1024
    const clampedLight = Math.max(0, Math.min(light, 1024));
    
    // Ngưỡng cho màu xám
    const grayThreshold = 100;

    // Tính toán tỷ lệ dựa trên cường độ ánh sáng
    const ratio = clampedLight / 1024;

    // Màu sắc cho các ngưỡng cường độ ánh sáng
    const grayColor = { r: 128, g: 128, b: 128 };  // Xám
    const startColorDark = { r: 0, g: 0, b: 128 };  // Xanh dương
    const midColorDark = { r: 0, g: 128, b: 0 };    // Xanh lá nhạt
    const midColorBright = { r: 0, g: 255, b: 0 };   // Xanh lá sáng
    const endColorBright = { r: 255, g: 255, b: 0 };  // Vàng đậm

    // Tính toán màu sắc cho gradient
    let color1, color2;
    let mixRatio;
    if (clampedLight <= grayThreshold) {
        // Chuyển từ xám đến xanh dương nhạt
        mixRatio = clampedLight / grayThreshold; // Tỷ lệ chuyển đổi từ 0 đến 1
        color1 = grayColor;
        color2 = startColorDark;
    } else if (clampedLight <= 500) {
        // Chuyển từ xanh dương nhạt sang xanh lá nhạt
        mixRatio = (clampedLight - grayThreshold) / (500 - grayThreshold); // Tỷ lệ chuyển đổi từ 0 đến 1
        color1 = startColorDark;
        color2 = midColorDark;
    } else {
        // Chuyển từ xanh lá sáng sang vàng đậm
        mixRatio = (clampedLight - 500) / (1024 - 500); // Tỷ lệ chuyển đổi từ 0 đến 1
        color1 = midColorBright;
        color2 = endColorBright;
    }

    // Tính toán màu cuối cùng
    const r = Math.round(color1.r * (1 - mixRatio) + color2.r * mixRatio);
    const g = Math.round(color1.g * (1 - mixRatio) + color2.g * mixRatio);
    const b = Math.round(color1.b * (1 - mixRatio) + color2.b * mixRatio);

    // Sử dụng alpha thấp hơn và kiểm soát độ sáng
    return `linear-gradient(to bottom, rgba(${r}, ${g}, ${b}, 1), rgba(${r}, ${g}, ${b}, 0.8))`;
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
