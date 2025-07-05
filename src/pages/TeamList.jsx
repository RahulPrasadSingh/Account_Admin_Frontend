import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  Filter,
  Search,
  UserPlus
} from 'lucide-react';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const TeamList = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: 'all',
    role: 'all',
    isActive: 'true'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, [filters]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getAll(filters);
      setTeamMembers(response.data);
    } catch (error) {
      toast.error('Failed to fetch team members');
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (empId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamAPI.delete(empId);
        toast.success('Team member deleted successfully');
        fetchTeamMembers();
      } catch (error) {
        toast.error('Failed to delete team member');
        console.error('Error deleting team member:', error);
      }
    }
  };

  const handlePermanentDelete = async (empId) => {
    if (window.confirm('Are you sure you want to permanently delete this team member? This action cannot be undone.')) {
      try {
        await teamAPI.permanentDelete(empId);
        toast.success('Team member permanently deleted');
        fetchTeamMembers();
      } catch (error) {
        toast.error('Failed to permanently delete team member');
        console.error('Error permanently deleting team member:', error);
      }
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const uniqueDepartments = [...new Set(teamMembers.map(member => member.department).filter(Boolean))];
  const uniqueRoles = [...new Set(teamMembers.map(member => member.role))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>
        <Link
          to="/team/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Add Team Member
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <select
            value={filters.isActive}
            onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="true">Active Members</option>
            <option value="false">Inactive Members</option>
          </select>
        </div>
      </div>

      {/* Team Members Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first team member'}
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div key={member.empId} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={member.image.url}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.empId}</p>
                      <p className="text-sm text-blue-600 font-medium">{member.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {member.department && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Department:</span> {member.department}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {member.experience} years
                    </p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Qualifications:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.qualification.map((qual, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {qual}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Link
                        to={`/team/view/${member.empId}`}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/team/edit/${member.empId}`}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(member.empId)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      member.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TeamList;