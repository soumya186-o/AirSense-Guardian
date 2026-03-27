/*
 * Author: Daksha009
 * Repo: https://github.com/Daksha009/AirSense-Guardian.git
 */
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LungSimulatorPage from './pages/LungSimulatorPage';
import LiquidEther from './components/LiquidEther';
import HealthRiskPanel from './components/HealthRiskPanel';
import CitizenReportPanel from './components/CitizenReportPanel';

function App() {
  const [aqiData, setAqiData] = useState(null);

  const handleDataUpdate = (data) => {
    setAqiData(data);
  };

  return (
    <Router>
      <div className="min-h-screen relative">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -2 }}>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            color0="#5227FF"
            color1="#FF9FFC"
            color2="#B19EEF"
          />
        </div>

        <Routes>
          <Route
            path="/"
            element={<Home aqiData={aqiData} handleDataUpdate={handleDataUpdate} />}
          />
          <Route
            path="/lung-simulator"
            element={<LungSimulatorPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
