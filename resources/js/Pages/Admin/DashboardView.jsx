import React, { useState, useEffect } from 'react';
import { Film, Users, Activity } from 'lucide-react';

const DashboardView = () => {
  const [movies, setMovies] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        'Accept': 'application/json',
      };

      const [moviesData, usersData] = await Promise.all([
        fetch('/api/movies', { headers }).then(res => res.json()),
        fetch('/api/users', { headers }).then(res => res.json())
      ]);

      setMovies(moviesData);
      setTotalUsers(usersData.data.length);
      setActiveUsers(usersData.data.filter(user => user.is_active).length);
      setRevenue(12426);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      alert('Error fetching data. Please try again.');
    }
  };

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400">Total Movies</h3>
            <Film className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2 dark:text-white">{movies.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400">Total Users</h3>
            <Users className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2 dark:text-white">{totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400">Revenue</h3>
            <Activity className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2 dark:text-white">${revenue}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 dark:text-gray-400">Active Users</h3>
            <Users className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2 dark:text-white">{activeUsers}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium dark:text-white">New user registration</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">John Doe signed up</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">5 min ago</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Film className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium dark:text-white">New movie added</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">The Matrix Resurrections</p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;