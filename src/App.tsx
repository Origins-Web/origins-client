import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OriginsLanding from '../src/LandingPage';
import ClientDashboard from '../src/ClientDashBoard';
import DevClientPortal from './DevClientPortal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketing Face */}
        <Route path="/" element={<OriginsLanding />} />
        
        {/* Client Access */}
        <Route path="/portal" element={<ClientDashboard />} />
        
        {/* Internal Engineering Control */}
        <Route path="/command" element={<DevClientPortal />} />
        
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
