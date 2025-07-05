import React, { useState, useEffect } from 'react';
import { Users, Award, TrendingUp, Building2, UserCheck } from 'lucide-react';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const TeamStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    departmentStats: [],
    roleStats: [],
    averageExperience: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch team statistics');
      console.error('Error fetching team stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, data, emptyMessage }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = data.length > 0 ? (item.count / Math.max(...data.map(d => d.count))) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 min-w-0 flex-1">
                    {item._id || 'Unassigned'}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Statistics</h1>
        <p className="text-gray-600">Overview of your team composition and metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          color="bg-blue-500"
          subtitle="Active team members"
        />
        
        <StatCard
          title="Departments"
          value={stats.departmentStats.length}
          icon={Building2}
          color="bg-green-500"
          subtitle="Active departments"
        />
        
        <StatCard
          title="Roles"
          value={stats.roleStats.length}
          icon={UserCheck}
          color="bg-purple-500"
          subtitle="Different positions"
        />
        
        <StatCard
          title="Avg Experience"
          value={`${Math.round(stats.averageExperience * 10) / 10}`}
          icon={Award}
          color="bg-orange-500"
          subtitle="Years of experience"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Team by Department"
          data={stats.departmentStats}
          emptyMessage="No departments assigned yet"
        />
        
        <ChartCard
          title="Team by Role"
          data={stats.roleStats}
          emptyMessage="No roles assigned yet"
        />
      </div>

      {/* Additional Insights */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Most Common Department</h4>
            <p className="text-gray-600">
              {stats.departmentStats.length > 0 
                ? `${stats.departmentStats[0]._id || 'Unassigned'} (${stats.departmentStats[0].count} members)`
                : 'No departments assigned'
              }
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Most Common Role</h4>
            <p className="text-gray-600">
              {stats.roleStats.length > 0 
                ? `${stats.roleStats[0]._id} (${stats.roleStats[0].count} members)`
                : 'No roles assigned'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStats;