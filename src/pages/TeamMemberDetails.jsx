import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Award, Star } from 'lucide-react';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const TeamMemberDetails = () => {
  const navigate = useNavigate();
  const { empId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMember();
  }, [empId]);

  const fetchTeamMember = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getById(empId);
      
      if (response.success) {
        setMember(response.data);
      } else {
        toast.error('Team member not found');
        navigate('/team');
      }
    } catch (error) {
      toast.error('Failed to fetch team member details');
      console.error('Error fetching team member:', error);
      navigate('/team');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamAPI.delete(empId);
        toast.success('Team member deleted successfully');
        navigate('/team');
      } catch (error) {
        toast.error('Failed to delete team member');
        console.error('Error deleting team member:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Member Not Found</h2>
        <button
          onClick={() => navigate('/team')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Team
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/team')}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Member Details</h1>
            <p className="text-gray-600">View complete profile information</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/team/edit/${member.empId}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-6">
            <img
              src={member.image.url}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="text-white">
              <h2 className="text-3xl font-bold">{member.name}</h2>
              <p className="text-blue-100 text-lg font-medium">{member.role}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-blue-400 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {member.empId}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  member.isActive 
                    ? 'bg-green-400 bg-opacity-50' 
                    : 'bg-red-400 bg-opacity-50'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-semibold text-gray-900">{member.experience} years</p>
              </div>
            </div>
            
            {member.department && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">{member.department}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Joined</p>
                <p className="font-semibold text-gray-900">
                  {new Date(member.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">{member.info}</p>
          </div>

          {/* About Me */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
            <p className="text-gray-700 leading-relaxed">{member.aboutMe}</p>
          </div>

          {/* Qualifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h3>
            <div className="flex flex-wrap gap-2">
              {member.qualification.map((qual, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {qual}
                </span>
              ))}
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas of Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((exp, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {new Date(member.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {new Date(member.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDetails;