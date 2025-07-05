import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  Tag, 
  Search,
  Filter,
  BookOpen,
  User,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle
} from 'lucide-react';
import { blogAPI } from '../services/api';
import toast from 'react-hot-toast';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('admin'); // 'admin' or 'public'

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory })
      };
      
      const response = await blogAPI.getAll(params);
      setBlogs(response.blogs);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Error fetching blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogAPI.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogAPI.delete(id);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        toast.error('Error deleting blog');
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateDetailed = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Get published blogs count
  const publishedBlogsCount = blogs.filter(blog => blog.isPublished).length;

  // Admin View Component
  const AdminBlogCard = ({ blog }) => (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              blog.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {blog.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          
          <p className="text-gray-600 mb-3">{truncateContent(stripHtmlTags(blog.content))}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime} min read</span>
            </div>
            {blog.category && (
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {blog.category}
                </span>
              </div>
            )}
          </div>
          
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {blog.image && (
          <div className="ml-4 flex-shrink-0">
            <img 
              src={blog.image} 
              alt={blog.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/blog/${blog._id}`}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">Preview</span>
          </Link>
          <Link
            to={`/blog/${blog._id}/public`}
            className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">View Public</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Link
            to={`/blogs/edit/${blog._id}`}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDelete(blog._id)}
            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Public View Component
  const PublicBlogCard = ({ blog }) => (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {blog.image && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {blog.category && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {blog.category}
            </span>
          )}
          <span className="text-gray-500 text-sm">
            {formatDate(blog.createdAt)}
          </span>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
          <Link to={`/blog/${blog._id}/public`}>
            {blog.title}
          </Link>
        </h2>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {truncateContent(stripHtmlTags(blog.content), 120)}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime} min read</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-green-500 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-gray-100">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="text-gray-500 text-xs hover:text-blue-600 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-gray-400 text-xs">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Manage your blog content and view how it appears to users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'admin' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Admin View
            </button>
            <button
              onClick={() => setViewMode('public')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'public' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Public View
            </button>
          </div>
          <Link
            to="/blogs/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Blog
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog Stats - Updated to show more useful metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.totalBlogs || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{publishedBlogsCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Tag className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No blogs found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria' 
                : 'Create your first blog to get started'}
            </p>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'admin' ? 'bg-white rounded-lg shadow-sm border' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
          {viewMode === 'admin' ? (
            <div className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <AdminBlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            blogs.map((blog) => (
              <PublicBlogCard key={blog._id} blog={blog} />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrev}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-1">
            {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
              const page = pagination.currentPage <= 3 
                ? index + 1 
                : pagination.currentPage + index - 2;
              
              if (page > pagination.totalPages) return null;
              
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNext}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;