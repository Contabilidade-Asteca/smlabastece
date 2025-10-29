import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import VehicleList from './components/VehicleList.jsx';
import DriverList from './components/DriverList.jsx';
import FuelingList from './components/FuelingList.jsx';

/*
 * The root component defines the overall layout of the application.  A
 * navigation bar persists across all pages, while the main area
 * renders whichever route has been selected by the user.  Routes
 * correspond to the dashboard, vehicle management, driver
 * management, and fuelings list.
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-4 md:p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<VehicleList />} />
          <Route path="/drivers" element={<DriverList />} />
          <Route path="/fuelings" element={<FuelingList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;