import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save, Eye } from 'lucide-react';
import { blogAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    isPublished: true,
    image: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewImage(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }
    
    if (!formData.author.trim()) {
      toast.error('Author is required');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Append all form data
      submitData.append('title', formData.title.trim());
      submitData.append('content', formData.content.trim());
      submitData.append('author', formData.author.trim());
      
      // Only append category if it has a value
      if (formData.category.trim()) {
        submitData.append('category', formData.category.trim());
      }
      
      // Only append tags if they exist
      if (formData.tags.trim()) {
        submitData.append('tags', formData.tags.trim());
      }
      
      // Convert boolean to string for FormData
      submitData.append('isPublished', formData.isPublished.toString());
      
      // Only append image if one is selected
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      // Debug: Log form data (remove in production)
      console.log('Submitting form data:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }
      
      const response = await blogAPI.create(submitData);
      
      if (response.success) {
        toast.success('Blog created successfully!');
        navigate('/blogs');
      } else {
        toast.error(response.message || 'Error creating blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      
      // Handle different types of errors
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 413) {
        toast.error('File size too large. Please choose a smaller image.');
      } else if (error.response?.status === 400) {
        toast.error('Please check your input data and try again.');
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/blogs')}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Author name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Blog category"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separate tags with commas (e.g., tax, business, finance)
              </p>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                placeholder="Write your blog content here..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Write your blog content in markdown or plain text
              </p>
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              
              {previewImage ? (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG, GIF up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Publishing Options */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                  Publish immediately
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Uncheck to save as draft
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {formData.isPublished ? 'Publish Blog' : 'Save as Draft'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;