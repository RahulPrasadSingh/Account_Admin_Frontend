import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  Heart, 
  MessageCircle, 
  Share2,
  BookOpen,
  Edit,
  Eye,
  Copy,
  Check,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react';
import { blogAPI } from '../services/api';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [viewMode, setViewMode] = useState('public'); // 'public' or 'admin'
  const [liked, setLiked] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  useEffect(() => {
    fetchBlog();
    // Determine view mode based on URL
    const isPublicView = window.location.pathname.includes('/public');
    setViewMode(isPublicView ? 'public' : 'admin');
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getById(id);
      setBlog(response.blog);
      
      // Fetch related blogs if blog has category
      if (response.blog.category) {
        fetchRelatedBlogs(response.blog.category, response.blog._id);
      }
    } catch (error) {
      toast.error('Error fetching blog');
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category, excludeId) => {
    try {
      const response = await blogAPI.getBlogsByCategory(category, { limit: 3 });
      const filtered = response.blogs.filter(b => b._id !== excludeId);
      setRelatedBlogs(filtered);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDatetime = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    // Here you would typically make an API call to save the like
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    setShareDropdownOpen(false);
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setUrlCopied(true);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const renderContent = (content) => {
    // Simple content rendering - in a real app, you might want to use a proper markdown/HTML renderer
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() && (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      )
    ));
  };

  const AdminView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/blogs')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <span className="text-sm text-gray-500">Admin Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/blog/${blog._id}/public`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Public
              </Link>
              <Link
                to={`/blogs/edit/${blog._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-8">
            <PublicBlogContent />
          </div>
        </div>
      </div>
    </div>
  );

  const PublicView = () => (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Public Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                liked 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{liked ? 'Liked' : 'Like'}</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              {shareDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4 text-blue-400" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Linkedin className="w-4 h-4 text-blue-700" />
                    LinkedIn
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={copyUrl}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    {urlCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <PublicBlogContent />
      </div>
    </div>
  );

  const PublicBlogContent = () => (
    <>
      {/* Featured Image */}
      {blog.image && (
        <div className="aspect-video mb-8 rounded-lg overflow-hidden">
          <img 
            src={blog.image} 
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Category & Status */}
      <div className="flex items-center gap-3 mb-6">
        {blog.category && (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {blog.category}
          </span>
        )}
        {blog.status && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            blog.status === 'published' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {blog.status}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
        {blog.title}
      </h1>

      {/* Meta Information */}
      <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
        {blog.author && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{blog.author}</span>
          </div>
        )}
        {blog.publishDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.publishDate)}</span>
          </div>
        )}
        {blog.readTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{blog.readTime} min read</span>
          </div>
        )}
        {blog.updatedAt && (
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span>Updated {formatDatetime(blog.updatedAt)}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {blog.description && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            {blog.description}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="prose max-w-none mb-12">
        {blog.content && renderContent(blog.content)}
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="border-t pt-12">
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((relatedBlog) => (
              <div key={relatedBlog._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {relatedBlog.image && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={relatedBlog.image} 
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                    {relatedBlog.title}
                  </h4>
                  {relatedBlog.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {relatedBlog.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(relatedBlog.publishDate)}
                    </div>
                    <Link
                      to={`/blog/${relatedBlog._id}/public`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/blogs')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return viewMode === 'admin' ? <AdminView /> : <PublicView />;
};

export default BlogDetail;