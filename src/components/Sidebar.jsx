import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Users, 
  FileText,
  Plus,
  UserPlus,
  BarChart3,
  MessageSquare,
  Mail,
  Building,
  FolderPlus,
  BookOpen,
  Edit,
  Tags,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // Get saved width from localStorage or default to 280
    const savedWidth = localStorage.getItem('sidebarWidth');
    return savedWidth ? parseInt(savedWidth) : 280;
  });
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get saved collapsed state from localStorage or default to false
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    return savedCollapsed ? JSON.parse(savedCollapsed) : false;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const minWidth = 60;
  const maxWidth = 400;
  const collapsedWidth = 60;

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [sidebarWidth, isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
        setIsCollapsed(newWidth <= 80);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const toggleSidebar = () => {
    if (isCollapsed) {
      setSidebarWidth(280);
      setIsCollapsed(false);
    } else {
      setSidebarWidth(collapsedWidth);
      setIsCollapsed(true);
    }
  };

  const menuItems = [
    { path: '/services', label: 'Services', icon: FileText },
    { path: '/services/create', label: 'Add Service', icon: Plus },
  ];

  const teamMenuItems = [
    { path: '/team', label: 'Team Members', icon: Users },
    { path: '/team/create', label: 'Add Member', icon: UserPlus },
    { path: '/team/stats', label: 'Team Stats', icon: BarChart3 },
  ];

  const contactMenuItems = [
    { path: '/contacts', label: 'Contact Inquiries', icon: MessageSquare },
    { path: '/contacts/stats', label: 'Contact Stats', icon: Mail },
  ];

  const clientageMenuItems = [
    { path: '/clientage', label: 'Client Categories', icon: Building },
    { path: '/clientage/create', label: 'Add Category', icon: FolderPlus },
  ];

  const blogMenuItems = [
    { path: '/blogs', label: 'All Blogs', icon: BookOpen },
    { path: '/blogs/create', label: 'Create Blog', icon: Edit },
    
  ];

  const renderMenuSection = (title, items) => (
    <div className="mb-6">
      {!isCollapsed && (
        <div className="px-4 mb-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </h2>
        </div>
      )}
      
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 group relative',
              isActive
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
              isCollapsed ? 'justify-center' : ''
            )}
            title={isCollapsed ? item.label : ''}
          >
            <Icon className={clsx('w-5 h-5 flex-shrink-0', !isCollapsed && 'mr-3')} />
            {!isCollapsed && (
              <span className="truncate">{item.label}</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="bg-white shadow-lg h-full flex flex-col relative flex-shrink-0"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-800 truncate">CA Firm Admin</h1>
                <p className="text-xs text-gray-500 truncate">Management Portal</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md mx-auto">
              <Building className="w-6 h-6 text-white" />
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {renderMenuSection('Services Management', menuItems)}
          {renderMenuSection('Team Management', teamMenuItems)}
          {renderMenuSection('Contact Management', contactMenuItems)}
          {renderMenuSection('Clientage Management', clientageMenuItems)}
          {renderMenuSection('Blog Management', blogMenuItems)}
        </nav>

        {/* Resize Handle */}
        <div
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-300 transition-colors group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-8 bg-gray-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <GripVertical className="w-3 h-3 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Overlay for resizing */}
      {isResizing && (
        <div className="fixed inset-0 cursor-col-resize z-50" />
      )}

      {/* Custom Scrollbar Styles */}
      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default Sidebar;