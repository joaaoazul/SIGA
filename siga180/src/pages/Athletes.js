import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AthleteList from '../components/athletes/AthleteList';
import { useAthletes } from '../hooks/useAthletes';

const Athletes = () => {
  const { athletes, searchAthletes } = useAthletes();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredAthletes, setFilteredAthletes] = useState([]);

  useEffect(() => {
    let result = athletes;

    // Apply search filter
    if (searchQuery) {
      result = searchAthletes(searchQuery);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(athlete => athlete.status === filterStatus);
    }

    setFilteredAthletes(result);
  }, [athletes, searchQuery, filterStatus]);

  // Calculate statistics
  const stats = {
    total: athletes.length,
    active: athletes.filter(a => a.status === 'active').length,
    checkInsToday: athletes.filter(a => {
      if (!a.lastCheckIn) return false;
      const today = new Date().toDateString();
      return new Date(a.lastCheckIn).toDateString() === today;
    }).length,
    pendingMeasurements: athletes.filter(a => {
      if (!a.lastMeasurement) return true;
      const lastDate = new Date(a.lastMeasurement);
      const daysSince = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
      return daysSince >= 10;
    }).length
  };

  return (
    <Layout title="Athletes">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Athletes</h1>
              <p className="text-gray-600 mt-1">Manage your athletes and track their progress</p>
            </div>
            <Link
              to="/athletes/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Athlete
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Athletes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Check-ins Today</p>
                <p className="text-2xl font-bold text-blue-600">{stats.checkInsToday}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Measurements</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingMeasurements}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Athlete List Component */}
        <AthleteList 
          athletes={filteredAthletes}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      </div>
    </Layout>
  );
};

export default Athletes;