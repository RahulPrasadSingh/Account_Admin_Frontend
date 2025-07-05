import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save, Eye, Loader } from 'lucide-react';
import { blogAPI } from '../services/api';
import toast from 'react-hot-toast';

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    tags: '',
    isPublished: true,
    image: null
  });

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setFetchLoading(true);
      const response = await blogAPI.getById(id);
      const blog = response.blog;
      
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        author: blog.author || '',
        category: blog.category || '',
        tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
        isPublished: blog.isPublished || false,
        image: null // We'll handle existing image separately
      });
      
      if (blog.image) {
        setExistingImage(blog.image);
      }
    } catch (error) {
      toast.error('Error fetching blog');
      console.error('Error fetching blog:', error);
      navigate('/blogs');
    } finally {
      setFetchLoading(false);
    }
  };

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
  };

  const removeExistingImage = () => {
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('author', formData.author);
      submitData.append('category', formData.category);
      submitData.append('tags', formData.tags);
      submitData.append('isPublished', formData.isPublished);
      
      // If there's a new image, add it
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      // If existing image was removed, indicate that
      if (!existingImage && !formData.image) {
        submitData.append('removeImage', 'true');
      }
      
      await blogAPI.update(id, submitData);
      toast.success('Blog updated successfully!');
      navigate('/blogs');
    } catch (error) {
      toast.error('Error updating blog');
      console.error('Error updating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              
              {/* Show existing image if no new image is selected */}
              {existingImage && !previewImage && (
                <div className="relative mb-4">
                  <img 
                    src={existingImage} 
                    alt="Current featured image" 
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeExistingImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Current Image
                  </div>
                </div>
              )}
              
              {/* Show preview image if new image is selected */}
              {previewImage && (
                <div className="relative mb-4">
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
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    New Image
                  </div>
                </div>
              )}
              
              {/* Upload area - show when no image is present */}
              {!existingImage && !previewImage && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
              
              {/* Change image button when image exists */}
              {(existingImage || previewImage) && (
                <div className="mt-4">
                  <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
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
                  Publish blog
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
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Blog
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;