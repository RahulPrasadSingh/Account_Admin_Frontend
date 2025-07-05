import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_BASE_URL,
});

// Services API
export const servicesAPI = {
  // Get all services with pagination and filtering
  getAll: async (params = {}) => {
    const response = await api.get('/services', { params });
    return response.data;
  },

  // Get service by ID
  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create new service
  create: async (formData) => {
    const response = await api.post('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update service
  update: async (id, formData) => {
    const response = await api.put(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete service
  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },

  // Toggle service status
  toggleStatus: async (id) => {
    const response = await api.patch(`/services/${id}/toggle-status`);
    return response.data;
  },
};

// Team Members API
export const teamAPI = {
  // Get all team members with filtering
  getAll: async (params = {}) => {
    const response = await api.get('/team', { params });
    return response.data;
  },

  // Get team member by empId
  getById: async (empId) => {
    const response = await api.get(`/team/${empId}`);
    return response.data;
  },

  // Create new team member
  create: async (formData) => {
    const response = await api.post('/team', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update team member
  update: async (empId, formData) => {
    const response = await api.put(`/team/${empId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete team member (soft delete)
  delete: async (empId) => {
    const response = await api.delete(`/team/${empId}`);
    return response.data;
  },

  // Permanently delete team member
  permanentDelete: async (empId) => {
    const response = await api.delete(`/team/${empId}/permanent`);
    return response.data;
  },

  // Get team statistics
  getStats: async () => {
    const response = await api.get('/team/stats');
    return response.data;
  },
};

// Contact Management API
export const contactsAPI = {
  // Get all contacts with pagination and filtering
  getAll: async (params = {}) => {
    const response = await api.get('/contacts', { params });
    return response.data;
  },

  // Get contact by ID
  getById: async (id) => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  // Update contact status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/contacts/${id}/status`, { status });
    return response.data;
  },

  // Toggle read status
  toggleReadStatus: async (id) => {
    const response = await api.patch(`/contacts/${id}/read-status`);
    return response.data;
  },

  // Delete contact
  delete: async (id) => {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  },

  // Get contact statistics
  getStats: async () => {
    const response = await api.get('/contacts/stats');
    return response.data;
  },
};

export const clientageAPI = {
  // Get all categories
  getAll: async () => {
    const response = await api.get('/clientage');
    return response.data;
  },

  // Get category by ID
  getById: async (id) => {
    const response = await api.get(`/clientage/${id}`);
    return response.data;
  },

  // Create new category
  create: async (categoryData) => {
    const response = await api.post('/clientage', categoryData);
    return response.data;
  },

  // Update category
  update: async (id, categoryData) => {
    const response = await api.put(`/clientage/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  delete: async (id) => {
    const response = await api.delete(`/clientage/${id}`);
    return response.data;
  },

  // Add client type to category
  addClientType: async (id, clientType) => {
    const response = await api.post(`/clientage/${id}/client-types`, { clientType });
    return response.data;
  },

  // Remove client type from category
  removeClientType: async (id, clientType) => {
    const response = await api.delete(`/clientage/${id}/client-types`, { 
      data: { clientType } 
    });
    return response.data;
  },
};

// Blog Management API
export const blogAPI = {
  // Get all blogs with pagination and filtering
  getAll: async (params = {}) => {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  // Get blog by ID
  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  // Create new blog
  create: async (formData) => {
    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update blog
  update: async (id, formData) => {
    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete blog
  delete: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const response = await api.get('/blogs/categories');
    return response.data;
  },

  // Get blogs by category
  getBlogsByCategory: async (category, params = {}) => {
    const response = await api.get(`/blogs/category/${category}`, { params });
    return response.data;
  },
};

export default api;