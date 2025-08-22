"use client";
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DestinationsManager from './components/DestinationsManager';
import UsersManager from './components/UsersManager';
import AdminManager from './components/AdminManager';
import CineplaceManager from './components/CineplaceManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('destinations');

  const renderContent = () => {
    switch (activeTab) {
      case 'destinations':
        return <DestinationsManager />;
      case 'cinema':
        return <CineplaceManager />;
      case 'users':
        return <UsersManager />;
      case 'admins':
        return <AdminManager />;
      default:
        return <DestinationsManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;