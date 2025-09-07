"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import DestinationsManager from './components/DestinationsManager';
import UsersManager from './components/UsersManager';
import AdminManager from './components/AdminManager';
import CineplaceManager from './components/CineplaceManager';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('destinations');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Check if user has admin role
    if ((session.user as any)?.role !== 'admin') {
      router.push('/login');
      return;
    }
    
    setIsAuthorized(true);
  }, [session, status, router]);

  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

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