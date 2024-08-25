import React from 'react';
import Sidebar from './SideBar';
import '../css/Profile.css';
import { FaBars } from 'react-icons/fa';
import { useSidebar } from '../contexts/SidebarContext';
const Profile = () => {
    const { isSidebarOpen, toggleSidebar } = useSidebar();
  return (
    <div id="main">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        {isSidebarOpen && <Sidebar className={`sidebar ${isSidebarOpen ? '' : 'closed'}`} />}
      <div className={`profile-content ${isSidebarOpen ? '' : 'shifted'}`}>
        <div className="cover-photo">
          <img src="img/bia.jpg" alt="Cover Photo" />
        </div>
        <div className="profile-header">
          <div className="profile-picture">
            <img src="img/avt.jpg" alt="Profile" />
          </div>
          <div className="profile-info">
            <h1>Vũ Đình Thiết</h1>
            <p>Mã sinh viên: B21DCCN689</p>
            <p className="bio">
            Student at Posts and Telecommunications Institute of Technology
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Báo cáo</a>
              <a href="https://github.com/thiet003/IOT_2024" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
        <div className="profile-details">
          <div className="details-section about">
            <h2>About Me</h2>
            <p>Tôi luôn tìm kiếm cơ hội để mở rộng kiến thức và cải thiện kỹ năng trong các lĩnh vực công nghệ mới. Với sự nhiệt huyết và động lực, tôi không ngừng nỗ lực để tạo ra các giải pháp sáng tạo và hiệu quả trong ngành công nghiệp công nghệ.</p>
          </div>
          <div className="details-section education">
            <h2>Education</h2>
            <div>
                <img src="img/ptit.png" alt="" />
                <p>Sinh viên Học viện Công nghệ Bưu chính Viễn thông</p>
            </div>
            <div>
                <img src="img/clb.png" alt="" />
                <p>Làm việc tại CLB Lập trình PTIT</p>
            </div>
          </div>
          <div className="details-section skill">
  <h2>Skills</h2>
  <div className="skills">
    <div className="skills-item">
      <img src="img/react.png" alt="React Logo" className="skill-logo" />
      React - Basic
    </div>
    <div className="skills-item">
      <img src="img/node.png" alt="Node.js Logo" className="skill-logo" />
      Node.js - Advanced
    </div>
    <div className="skills-item">
      <img src="img/python.png" alt="Python Logo" className="skill-logo" />
      Python - Intermediate
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
