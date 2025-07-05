import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  EyeOff, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Users,
  BarChart3,
  PieChart,
  Calendar,
  X
} from 'lucide-react';
import { contactsAPI } from '../services/api';

const ContactStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await contactsAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatMonth = (monthData) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${months[monthData.month - 1]} ${monthData.year}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Statistics</h1>
        <p className="text-gray-600">Overview of customer inquiries and support metrics</p>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Contacts</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalContacts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <EyeOff className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.unreadContacts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.statusBreakdown?.find(s => s._id === 'pending')?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.statusBreakdown?.find(s => s._id === 'resolved')?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <PieChart className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Status Breakdown</h3>
          </div>
          <div className="space-y-4">
            {stats?.statusBreakdown?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(item._id)}`}></div>
                  <span className="text-sm font-medium text-gray-700 capitalize">{item._id}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900 mr-2">{item.count}</span>
                  <span className="text-sm text-gray-500">
                    ({((item.count / stats.totalContacts) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
          </div>
          <div className="space-y-4">
            {stats?.monthlyTrend?.map((item) => (
              <div key={`${item.year}-${item.month}`} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-700">{formatMonth(item)}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">{item.count}</span>
                  <span className="text-sm text-gray-500 ml-2">contacts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Popular Services</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.serviceBreakdown?.map((item) => (
            <div key={item._id} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{item._id}</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-purple-600">{item.count}</span>
                <span className="text-sm text-gray-500">
                  {((item.count / stats.totalContacts) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Time Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Clock className="w-6 h-6 text-orange-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Response Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats?.responseMetrics?.averageResponseTime || 0}h
            </div>
            <p className="text-sm text-gray-500">Average Response Time</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats?.responseMetrics?.respondedCount || 0}
            </div>
            <p className="text-sm text-gray-500">Responded Inquiries</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {stats?.responseMetrics?.pendingCount || 0}
            </div>
            <p className="text-sm text-gray-500">Pending Response</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactStats;