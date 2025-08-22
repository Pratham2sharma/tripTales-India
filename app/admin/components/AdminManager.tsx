"use client";
import React, { useState } from 'react';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Creating admin:', formData);
    setShowForm(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' });
  };

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      console.log('Deleting admin:', adminId);
      // Add API call here
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          + Create New Admin
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="border rounded-lg px-4 py-2 col-span-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Admin
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Admins</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No admins found. Create your first admin account!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManager;