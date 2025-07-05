import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Users,
  Tag,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { clientageAPI } from '../services/api';
import toast from 'react-hot-toast';

const ClientageList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await clientageAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await clientageAPI.delete(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.clientTypes.some(type => 
      type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Categories</h1>
          <p className="text-gray-600">Manage your client categories and types</p>
        </div>
        <Link
          to="/clientage/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories or client types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>{categories.length} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{categories.reduce((sum, cat) => sum + cat.clientTypes.length, 0)} Client Types</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms.' 
                : 'Get started by creating your first client category.'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/clientage/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Category
              </Link>
            )}
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.categoryName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Tag className="w-4 h-4" />
                    <span>{category.clientTypes.length} client types</span>
                    <span className="text-gray-300">•</span>
                    <span>Created {new Date(category.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/clientage/edit/${category._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Edit category"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id, category.categoryName)}
                    disabled={deleteLoading === category._id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    title="Delete category"
                  >
                    {deleteLoading === category._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Client Types */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Client Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {category.clientTypes.map((type, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientageList;