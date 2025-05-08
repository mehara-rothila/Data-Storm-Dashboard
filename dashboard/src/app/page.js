'use client';

import dynamic from 'next/dynamic';

// Import the Dashboard component with no SSR
const Dashboard = dynamic(() => import('../components/Dashboard/Dashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return <Dashboard />;
}