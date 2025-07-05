import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';

// Services Components
import ServicesList from './pages/ServicesList';
import CreateService from './pages/CreateService';
import EditService from './pages/EditService';

// Team Components
import TeamList from './pages/TeamList';
import CreateTeamMember from './pages/CreateTeamMember';
import EditTeamMember from './pages/EditTeamMember';
import TeamMemberDetails from './pages/TeamMemberDetails';
import TeamStats from './pages/TeamStats';

// Contact Components
import ContactsList from './pages/ContactsList';
import ContactStats from './pages/ContactStats';

// Clientage Components
import ClientageList from './pages/ClientageList';
import CreateCategory from './pages/CreateCategory';
import EditCategory from './pages/EditCategory';

// Blog Components
import BlogList from './pages/BlogList';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetail from './pages/BlogDetail';

import './App.css';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation Bar (optional) */}
          <div className="bg-white shadow-sm px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                CA Firm Management
              </h2>
              <div className="flex items-center space-x-4">
                {/* Add any top bar content here */}
              </div>
            </div>
          </div>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-full">
              <Routes>
                {/* Default Route */}
                <Route path="/" element={<ServicesList />} />
                
                {/* Services Routes */}
                <Route path="/services" element={<ServicesList />} />
                <Route path="/services/create" element={<CreateService />} />
                <Route path="/services/edit/:id" element={<EditService />} />
                
                {/* Team Routes */}
                <Route path="/team" element={<TeamList />} />
                <Route path="/team/create" element={<CreateTeamMember />} />
                <Route path="/team/edit/:empId" element={<EditTeamMember />} />
                <Route path="/team/view/:empId" element={<TeamMemberDetails />} />
                <Route path="/team/stats" element={<TeamStats />} />
                
                {/* Contact Routes */}
                <Route path="/contacts" element={<ContactsList />} />
                <Route path="/contacts/stats" element={<ContactStats />} />
                
                {/* Clientage Routes */}
                <Route path="/clientage" element={<ClientageList />} />
                <Route path="/clientage/create" element={<CreateCategory />} />
                <Route path="/clientage/edit/:id" element={<EditCategory />} />

                {/* Blog Routes */}
                <Route path="/blogs" element={<BlogList />} />
                <Route path="/blogs/create" element={<CreateBlog />} />
                <Route path="/blogs/edit/:id" element={<EditBlog />} />
                
                {/* Blog Detail Routes */}
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/blog/:id/public" element={<BlogDetail />} />
              </Routes>
            </div>
          </main>
        </div>
        
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;