import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const menuItems = [
    { id: 'destinations', label: 'Destinations', icon: '🏞️' },
    { id: 'cinema', label: 'Cinema Destinations', icon: '🎬' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'admins', label: 'Create Admin', icon: '👨‍💼' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen relative">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-sm text-gray-500">TripTales India</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
              activeTab === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-700'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Admin Info & Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50">
        <div className="mb-3">
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="font-medium text-gray-800 truncate">{session?.user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;