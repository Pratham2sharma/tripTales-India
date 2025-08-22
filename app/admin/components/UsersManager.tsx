'use client';

import React, { useEffect } from 'react';
import { useUserStore } from '../../../store/userStore';

const UsersManager: React.FC = () => {
  const { users, loading, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-black">Users Management</h2>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-black">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-black font-semibold">Username</th>
                    <th className="text-left py-3 px-4 text-black font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-black font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-black font-semibold">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-black">{user.username}</td>
                      <td className="py-3 px-4 text-black">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-black">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8 text-black">No users found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManager;