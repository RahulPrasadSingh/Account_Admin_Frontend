import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { servicesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchServices();
  }, [currentPage, filter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };

      if (filter !== 'all') {
        params.isActive = filter === 'active';
      }

      const response = await servicesAPI.getAll(params);
      setServices(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to fetch services');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, serviceName) => {
    if (window.confirm(`Are you sure you want to delete "${serviceName}"?`)) {
      try {
        await servicesAPI.delete(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        toast.error('Failed to delete service');
        console.error('Error deleting service:', error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await servicesAPI.toggleStatus(id);
      toast.success(`Service ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchServices();
    } catch (error) {
      toast.error('Failed to update service status');
      console.error('Error toggling service status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-1">Manage your CA firm services</p>
        </div>
        <Link
          to="/services/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => {
                setFilter(filterOption);
                setCurrentPage(1);
              }}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              )}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beneficiary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-lg object-cover"
                      src={service.image}
                      alt={service.serviceName}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {service.serviceName}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {service.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{service.beneficiary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={clsx(
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      service.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(service.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleToggleStatus(service._id, service.isActive)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      title={service.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {service.isActive ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                    </button>
                    <Link
                      to={`/services/edit/${service._id}`}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(service._id, service.serviceName)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;