import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle,
  XCircle,
  PauseCircle,
  Calendar,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

const AthleteList = ({ 
  athletes, 
  searchQuery, 
  setSearchQuery, 
  filterStatus, 
  setFilterStatus 
}) => {
  const [showDropdown, setShowDropdown] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const getLastCheckIn = (athlete) => {
    const lastCheckIn = athlete.lastCheckIn || null;
    if (!lastCheckIn) return <span className="text-gray-400">No check-in</span>;
    
    const today = new Date();
    const checkInDate = new Date(lastCheckIn);
    const diffDays = Math.floor((today - checkInDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return <span className="text-green-600">Today</span>;
    if (diffDays === 1) return <span className="text-yellow-600">Yesterday</span>;
    return <span className="text-red-600">{diffDays} days ago</span>;
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search athletes by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Athletes Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Athlete
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Check-in
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Next Measurement
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {athletes.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                 
                    <p className="text-lg font-medium">No athletes found</p>
                    <p className="text-sm mt-1">Start by adding your first athlete</p>
                  </div>
                </td>
              </tr>
            ) : (
              athletes.map((athlete) => (
                <tr key={athlete.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/athletes/${athlete.id}`} className="flex items-center hover:opacity-80">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={athlete.avatar || `https://i.pravatar.cc/150?u=${athlete.id}`} 
                          alt="" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {athlete.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {athlete.email}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(athlete.status || 'active')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {athlete.plan || 'No plan assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getLastCheckIn(athlete)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {athlete.nextMeasurement ? (
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(athlete.nextMeasurement).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-orange-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === athlete.id ? null : athlete.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {showDropdown === athlete.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                          <Link
                            to={`/athletes/${athlete.id}`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(null)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                          <Link
                            to={`/athletes/${athlete.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(null)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                          <button
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                            onClick={() => {
                              // Implement delete functionality
                              setShowDropdown(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AthleteList;