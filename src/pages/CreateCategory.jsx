import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Save, Building } from 'lucide-react';
import { clientageAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: '',
    clientTypes: ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClientTypeChange = (index, value) => {
    const newClientTypes = [...formData.clientTypes];
    newClientTypes[index] = value;
    setFormData(prev => ({
      ...prev,
      clientTypes: newClientTypes
    }));
  };

  const addClientType = () => {
    setFormData(prev => ({
      ...prev,
      clientTypes: [...prev.clientTypes, '']
    }));
  };

  const removeClientType = (index) => {
    if (formData.clientTypes.length > 1) {
      const newClientTypes = formData.clientTypes.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        clientTypes: newClientTypes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    const filteredClientTypes = formData.clientTypes.filter(type => type.trim());
    if (filteredClientTypes.length === 0) {
      toast.error('At least one client type is required');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        categoryName: formData.categoryName.trim(),
        clientTypes: filteredClientTypes
      };

      await clientageAPI.create(submitData);
      toast.success('Category created successfully');
      navigate('/clientage');
    } catch (error) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/clientage')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Category</h1>
            <p className="text-gray-600">Add a new client category with associated client types</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter category name (e.g., Individual Clients, Corporate Clients)"
              required
            />
          </div>

          {/* Client Types */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Client Types *
              </label>
              <button
                type="button"
                onClick={addClientType}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Type
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.clientTypes.map((type, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => handleClientTypeChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client type (e.g., Freelancer, Small Business)"
                  />
                  {formData.clientTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeClientType(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              Add different types of clients that belong to this category
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Category
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/clientage')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Tips for Creating Categories:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose descriptive names that clearly identify the client group</li>
          <li>• Add specific client types to help organize your clientele</li>
          <li>• Consider grouping by business size, industry, or service needs</li>
          <li>• You can always edit or add more client types later</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateCategory;