import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import { SidebarProvider } from './contexts/SidebarContext'
import ActionHistory from './components/HistoryAction';
import DataSensor from './components/DataSensor';
function App() {
  return (
    <SidebarProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history-action" element={<ActionHistory />} />
          <Route path="/data-sensor" element={<DataSensor />} />
        </Routes>
      </div>
    </Router>
    </SidebarProvider>
  );
}

export default App;
