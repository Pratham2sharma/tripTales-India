"use client";
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout