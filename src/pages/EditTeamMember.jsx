import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const EditTeamMember = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    qualification: [''],
    experience: '',
    expertise: [''],
    department: '',
    role: '',
    info: '',
    aboutMe: '',
    image: null
  });

  useEffect(() => {
    fetchTeamMember();
  }, [empId]);

  const fetchTeamMember = async () => {
    try {
      setFetching(true);
      const response = await teamAPI.getById(empId);
      
      if (response.success) {
        const member = response.data;
        setFormData({
          empId: member.empId,
          name: member.name,
          qualification: member.qualification || [''],
          experience: member.experience,
          expertise: member.expertise || [''],
          department: member.department || '',
          role: member.role,
          info: member.info,
          aboutMe: member.aboutMe,
          image: null
        });
        setImagePreview(member.image.url);
      }
    } catch (error) {
      toast.error('Failed to fetch team member details');
      console.error('Error fetching team member:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'qualification' || key === 'expertise') {
          // Filter out empty strings and join with commas
          const arrayData = formData[key].filter(item => item.trim() !== '');
          if (arrayData.length > 0) {
            submitData.append(key, arrayData.join(','));
          }
        } else if (key === 'image') {
          if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        } else if (key !== 'empId') { // Don't include empId in update data
          submitData.append(key, formData[key]);
        }
      });

      const response = await teamAPI.update(empId, submitData);
      
      if (response.success) {
        toast.success('Team member updated successfully');
        navigate('/team');
      } else {
        toast.error(response.message || 'Failed to update team member');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update team member');
      console.error('Error updating team member:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/team')}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Team Member</h1>
          <p className="text-gray-600">Update team member profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="empId"
                value={formData.empId}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                placeholder="e.g., Senior CA, Junior Associate"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Audit, Tax, Advisory"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years) *
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Qualifications *</h2>
          
          {formData.qualification.map((qual, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={qual}
                onChange={(e) => handleArrayChange('qualification', index, e.target.value)}
                placeholder="e.g., CA, CPA, MBA"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.qualification.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('qualification', index)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('qualification')}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Qualification</span>
          </button>
        </div>

        {/* Areas of Expertise */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Areas of Expertise *</h2>
          
          {formData.expertise.map((exp, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={exp}
                onChange={(e) => handleArrayChange('expertise', index, e.target.value)}
                placeholder="e.g., Tax Planning, Financial Audit, GST"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.expertise.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('expertise', index)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('expertise')}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expertise</span>
          </button>
        </div>

        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Summary *
              </label>
              <textarea
                name="info"
                value={formData.info}
                onChange={handleInputChange}
                required
                rows={3}
                placeholder="Brief professional summary for display"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Me *
              </label>
              <textarea
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Detailed information about the team member"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h2>
          
          <div className="flex items-center space-x-6">
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Upload Image</p>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload a new professional photo (JPG, PNG) or leave empty to keep current image.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/team')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{loading ? 'Updating...' : 'Update Team Member'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeamMember;