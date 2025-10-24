import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  BookmarkPlus,
  BookmarkX,
  Download,
  Upload,
  Eye,
  FileText,
  Video,
  Image,
  Music,
  Bell,
  Menu,
  X,
  RefreshCw,
  Bot,
  Send,
  Star,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Clock,
  AlertCircle,
  User,
  Settings,
  LogOut,
  Wrench,
  CloudIcon,
  CloudUpload,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { useToast } from '../../components/ui/Toast';
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ToolsPanel from '../../components/tools/ToolsPanel.jsx';
import { studentAPI, bookmarkAPI, appAPI, aiAPI } from '../../utils/api';
import { motion as Motion } from 'framer-motion'
import Spinner from "../../components/auth/Spinner.jsx";
// Modal Component
function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 text-gray-900 dark:text-gray-100`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300" aria-label="Close">
            <X size={20} color="white"/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <RefreshCw className="animate-spin h-6 w-6 text-blue-600" />
      <span className="ml-2">Loading...</span>
    </div>
  );
}

// AI Chat Component
function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await aiAPI.chat({ prompt: input });
      const aiMessage = {
        role: "assistant",
        content: response.data.reply || "Sorry, I couldn't process your request."
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
 <Modal isOpen={isOpen} onClose={onClose} title="Zanly AI 🤖" size="xl">
  <div className="flex flex-col h-[32rem] bg-gradient-to-br from-[#0f172a]/80 via-[#1e3a8a]/70 to-[#312e81]/80 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden">
    
    {/* Messages */}
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-5 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl shadow-inner border border-white/10">
      {messages.length === 0 ? (
        <div className="text-center text-gray-300">
          <div className="flex flex-col items-center justify-center mt-10 space-y-3">
            <Bot className="h-14 w-14 text-blue-400 animate-pulse" />
            <p className="font-semibold text-lg tracking-wide">
              Hi! I'm <span className="text-blue-400 font-bold">Zanly AI</span> ✨  
            </p>
            <p className="text-gray-400 text-sm">Ask me anything about your studies or materials!</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-lg transition-all duration-200 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/30"
                  : "bg-white/15 border border-white/10 text-gray-100 backdrop-blur-md"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-[0.95rem]">
                {message.content}
              </p>
            </div>
          </Motion.div>
        ))
      )}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-2xl shadow-md backdrop-blur-md">
            <div className="flex space-x-2 items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <div className="relative flex items-center mt-auto bg-white/10 dark:bg-white/5 p-3 rounded-full border border-white/10 backdrop-blur-md shadow-inner">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask anything..."
        className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-400 px-3"
        disabled={loading}
      />
      <Motion.div whileTap={{ scale: 0.9 }}>
        <Button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="ml-2 rounded-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 transition-all"
        >
          <Send size={18} />
        </Button>
      </Motion.div>
    </div>
  </div>
</Modal>

  );
}

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  
  // Data states
  const [materials, setMaterials] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    class: "",
    subject: "",
    type: "",
    file: null
  });

  // Handle logout
  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }finally{
      setLoading(false)
    }
  };

  // Fetch materials with filters
  const fetchMaterials = async (pageNum = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = {
        page: pageNum,
        limit: 12,
        q: filters.search || search || undefined,
        class: filters.class || classFilter || undefined,
        subject: filters.subject || subjectFilter || undefined,
        type: filters.type || typeFilter || undefined,
      };
      const response = await studentAPI.getMaterials(params);
      setMaterials(response.data.materials || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search materials
  const searchMaterials = async (query) => {
    if (!query.trim()) {
      fetchMaterials();
      return;
    }
    
    try {
      setLoading(true);
      const response = await studentAPI.searchMaterials({ q: query, page: 1, limit: 12 });
      setMaterials(response.data.materials || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(1);
    } catch (error) {
      console.error('Error searching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter materials
  const filterMaterials = async (filters) => {
    try {
      setLoading(true);
      const response = await studentAPI.filterMaterials({ ...filters, page: 1, limit: 12 });
      setMaterials(response.data.materials || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(1);
    } catch (error) {
      console.error('Error filtering materials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const response = await bookmarkAPI.getBookmarks();
      setBookmarks(response.data.bookmarks || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  // Add bookmark
  const addBookmark = async (materialId) => {
    try {
      await bookmarkAPI.addBookmark({ materialId });
      fetchBookmarks();
      // Update materials to reflect bookmark status
      setMaterials(prev => prev.map(m => 
        m.id === materialId ? { ...m, isBookmarked: true } : m
      ));
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  // Remove bookmark
  const removeBookmark = async (materialId) => {
    try {
      await bookmarkAPI.removeBookmark(materialId);
      fetchBookmarks();
      setMaterials(prev => prev.map(m => 
        m.id === materialId ? { ...m, isBookmarked: false } : m
      ));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await appAPI.getNotifications();
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Upload material
  const uploadMaterial = async () => {
    if (!uploadForm.title || !uploadForm.class || !uploadForm.subject || !uploadForm.type || !uploadForm.file) {
      toast.warning('Please fill in all required fields');
      return;
    }
     setLoading(true)
    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('class', uploadForm.class);
      formData.append('subject', uploadForm.subject);
      formData.append('type', uploadForm.type);
      formData.append('file', uploadForm.file);

      await studentAPI.uploadMaterial(formData);

      // Reset form
      setUploadForm({
        title: "",
        description: "",
        class: "",
        subject: "",
        type: "",
        file: null
      });
      setShowUploadModal(false);
      toast.success('Material uploaded successfully! It will be reviewed by administrators.');
    } catch (error) {
      console.error('Error uploading material:', error);
      toast.error('Error uploading material. Please try again.');
    }finally{
      setLoading(false)
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      // Close user menu if clicking outside of it
      const menu = document.getElementById('user-menu-dropdown');
      const btn = document.getElementById('user-menu-button');
      if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchMaterials();
    fetchBookmarks();
    fetchNotifications();
  }, []);

  // Debounced search
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search) {
        searchMaterials(search);
      } else {
        fetchMaterials();
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  // Filter change handler
  useEffect(() => {
    if (classFilter || subjectFilter || typeFilter) {
      filterMaterials({ class: classFilter, subject: subjectFilter, type: typeFilter });
    } else if (!search) {
      fetchMaterials();
    }
  }, [classFilter, subjectFilter, typeFilter]);

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (fileType?.includes('image')) return <Image className="h-5 w-5" />;
    if (fileType?.includes('video')) return <Video className="h-5 w-5" />;
    if (fileType?.includes('audio')) return <Music className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const sidebarNavigation = [
    { id: 'overview', name: 'Overview', icon: <TrendingUp size={18} /> },
    { id: 'materials', name: 'Materials', icon: <BookOpen size={18} /> },
    { id: 'bookmarks', name: 'Bookmarks', icon: <Star size={18} /> },
    { id: 'upload', name: 'Upload', icon: <Upload size={18} /> },
    { id: 'tools', name: 'Tools', icon: <Wrench size={18} /> },
    // { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {/* Sidebar */}
      <div className={`fixed z-40 inset-y-0 left-0 w-64 max-w-[85vw] bg-gray-900 dark:bg-gray-950 text-white transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 md:translate-x-0 border-r border-gray-700 dark:border-gray-800`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <img src="/zanly-icon.jpg" alt="Zanly" className="w-8 h-8 rounded" />
            <h1 className="text-xl font-bold">Zanly</h1>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex flex-col p-4 space-y-2">
          {sidebarNavigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors text-left ${
                activeSection === item.id ? "bg-gray-700 dark:bg-gray-800 font-semibold" : ""
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        {/* AI Assistant Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={() => setShowAIChat(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Bot size={20} /> AI Assistant
          </Button>
        </div>
      </div>

      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Header */}
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await fetchNotifications();
                  setShowNotificationsModal(true);
                }}
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </div>

            {/* User Menu */}
            <div className="relative">
            <button
  id="user-menu-button"
  onClick={() => setShowUserMenu((s) => !s)}
  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
>
<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
  {user?.image ? (
    <img
      src={user.image}
      alt={user.name || "User"}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.onerror = null; // prevent infinite loop
        e.currentTarget.style.display = "none"; // hide broken image
      }}
    />
  ) : (
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U"
  )}
</div>

</button>
              {showUserMenu && (
                <div id="user-menu-dropdown" className="absolute right-0 mt-2 w-48 bg-white dark:bg-white rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-1">
                    <button
                      onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      <Settings size={16} className="mr-2" />
                      Settings
                    </button>
                    {isAdmin() && (
                      <button
                        onClick={() => { setShowUserMenu(false); navigate('/admin'); }}
                        className="flex items-center w-full px-3 py-2 text-sm text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-md"
                      >
                        <GraduationCap size={16} className="mr-2" />
                        Admin Panel
                      </button>
                    )}
                    <hr className="my-1 border-gray-200 dark:border-gray-600" />
                    <button
                      onClick={async () => { setShowUserMenu(false); await handleLogout(); }}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md"
                    >
                      {loading ? <Spinner size={5} color="white" /> : <LogOut size={16} className="mr-2" />}  
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Student'}!</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Available Materials</p>
                        <p className="text-3xl font-bold text-blue-900">{materials.length}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">My Bookmarks</p>
                        <p className="text-3xl font-bold text-green-900">{bookmarks.length}</p>
                      </div>
                      <Star className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Notifications</p>
                        <p className="text-3xl font-bold text-purple-900">{notifications.length}</p>
                      </div>
                      <Bell className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">Usage Progress</p>
                        <p className="text-3xl font-bold text-orange-900">50%</p>
                      </div>
                      <GraduationCap className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {materials.slice(0, 5).map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(material.fileType)}
                          <div>
                            <h4 className="font-semibold">{material.title}</h4>
                            <p className="text-sm text-gray-600">{material.subject} • Class {material.class}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => window.open(material.fileUrl, '_blank')}>
                            <Eye size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => material.isBookmarked ? removeBookmark(material.id) : addBookmark(material.id)}
                          >
                            {material.isBookmarked ? <BookmarkX size={14} /> : <BookmarkPlus size={14} />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Materials Section */}
          {activeSection === 'materials' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Study Materials</h2>
                <Button onClick={() => fetchMaterials()} variant="secondary">
                  <RefreshCw size={16} /> Refresh
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Classes</option>
                  {[...Array(12)].map((_, i) => (
                   
                    <option key={i+1} value={i+1}>Class {i+1}</option>
                    
                  
                  ))}
                  <option value="UG">UG</option>
                    <option value="PG">PG</option>
                </select>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Other">Other</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Notes">Notes</option>
                  <option value="Video">Video</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Practice">Practice</option>
                  <option value="Reference">Reference</option>
                  <option value="Papers">Papers</option>
                </select>
              </div>

              {/* Materials Grid */}
              {loading ? (
                <LoadingSpinner />
              ) : materials.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No materials found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {materials.map((material) => (
                      <Card key={material.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(material.fileType)}
                              <span className="text-sm text-gray-500">{material.type}</span>
                            </div>
                            <button
                              onClick={() => material.isBookmarked ? removeBookmark(material.id) : addBookmark(material.id)}
                              className={`p-1 rounded ${material.isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                            >
                              {material.isBookmarked ? <Star size={16} fill="currentColor" /> : <Star size={16} />}
                            </button>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{material.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{material.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>{material.subject}</span>
                            <span>Class {material.class}</span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => window.open(material.fileUrl, '_blank')}
                              className="flex-1"
                            >
                              <Eye size={14} /> View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = material.fileUrl;
                                link.download = material.title;
                                link.click();
                              }}
                            >
                              <Download size={14} />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="secondary" 
                        disabled={page === 1}
                        onClick={() => fetchMaterials(page - 1)}
                      >
                        Previous
                      </Button>
                      <span className="px-3 py-2 text-sm text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                      <Button 
                        variant="secondary" 
                        disabled={page === totalPages}
                        onClick={() => fetchMaterials(page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Bookmarks Section */}
          {activeSection === 'bookmarks' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">My Bookmarks</h2>
                <Button onClick={fetchBookmarks} variant="secondary">
                  <RefreshCw size={16} /> Refresh
                </Button>
              </div>

              {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No bookmarks yet</h3>
                  <p className="mt-2 text-gray-500">Start bookmarking materials to see them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(bookmark.material.fileType)}
                            <span className="text-sm text-gray-500">{bookmark.material.type}</span>
                          </div>
                          <button
                            onClick={() => removeBookmark(bookmark.material.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-50"
                          >
                            <BookmarkX size={16} />
                          </button>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2">{bookmark.material.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{bookmark.material.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{bookmark.material.subject}</span>
                          <span>Class {bookmark.material.class}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => window.open(bookmark.material.fileUrl, '_blank')}
                            className="flex-1"
                          >
                            <Eye size={14} /> View
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = bookmark.material.fileUrl;
                              link.download = bookmark.material.title;
                              link.click();
                            }}
                          >
                            <Download size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Section */}
          {activeSection === 'upload' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Upload Material</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Study Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Upload className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Upload Your Materials</h3>
                    <p className="mt-2 text-gray-500">Help other students by sharing your notes, assignments, and resources.</p>
                    <Button onClick={() => setShowUploadModal(true)} className="mt-4">
                      <Upload size={16} /> Upload Material
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
                <Button onClick={fetchNotifications} variant="secondary">
                  <RefreshCw size={16} /> Refresh
                </Button>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No new notifications</h3>
                  <p className="mt-2 text-gray-500">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{notification.title}</h4>
                            <p className="text-gray-600 mt-1">{notification.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>
                                <Clock size={14} className="inline mr-1" />
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                              <span>
                                <AlertCircle size={14} className="inline mr-1" />
                                Expires {new Date(notification.expiresAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tools Section */}
          {activeSection === 'tools' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tools</h2>
              <ToolsPanel/>
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}
     <Modal
  isOpen={showUploadModal}
  onClose={() => setShowUploadModal(false)}
  title="Upload Study Material"
  size="lg"
>
  <div className="space-y-6 p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl shadow-xl text-white">
    
    {/* Title */}
    <div>
      <label className="block text-sm font-semibold mb-2">Title *</label>
      <input
        type="text"
        value={uploadForm.title}
        onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
        placeholder="Enter material title"
        className="w-full p-3 rounded-lg border-2 border-white bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-white"
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-semibold mb-2">Description</label>
      <textarea
        value={uploadForm.description}
        onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
        rows={3}
        placeholder="Describe your material"
        className="w-full p-3 rounded-lg border-2 border-white bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-white"
      />
    </div>

    {/* Selects: Class, Subject, Type */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Class *</label>
        <select
          value={uploadForm.class}
          onChange={(e) => setUploadForm({...uploadForm, class: e.target.value})}
          className="w-full p-3 rounded-lg border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">Select Class</option>
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>Class {i+1}</option>
          ))}
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Subject *</label>
        <select
          value={uploadForm.subject}
          onChange={(e) => setUploadForm({...uploadForm, subject: e.target.value})}
          className="w-full p-3 rounded-lg border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">Select Subject</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Science">Science</option>
          <option value="English">English</option>
          <option value="History">History</option>
          <option value="Geography">Geography</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Type *</label>
        <select
          value={uploadForm.type}
          onChange={(e) => setUploadForm({...uploadForm, type: e.target.value})}
          className="w-full p-3 rounded-lg border-2 border-white bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">Select Type</option>
          <option value="Notes">Notes</option>
          <option value="Video">Video</option>
          <option value="Assignment">Assignment</option>
          <option value="Practice">Practice</option>
          <option value="Reference">Reference</option>
          <option value="Paper">Paper</option>
        </select>
      </div>
    </div>

    {/* File Upload */}
    <div>
      <label className="block text-sm font-semibold mb-2">Upload File *</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          if (e.dataTransfer.files[0]) setUploadForm({ ...uploadForm, file: e.dataTransfer.files[0] });
        }}
        className={`relative w-full p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors duration-200
          ${hover ? 'border-white bg-white/20' : 'border-white bg-white/10'}`}
      >
        <CloudUpload className="w-10 h-10 mb-2 text-white" />
        <p className="text-white text-center">Drag & drop your file here, or click to browse</p>
        {uploadForm.file && (
          <p className="mt-2 text-sm font-medium text-white">Selected: {uploadForm.file.name}</p>
        )}
        <input
          type="file"
          onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-xs mt-2 text-white">Supported formats: PDF, DOC, PPT, MP4, Images (Max 10MB)</p>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3 pt-4">
      <Button
        variant="secondary"
        onClick={() => setShowUploadModal(false)}
        className="px-6 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
      >
        Cancel
      </Button>
      <Button
        onClick={uploadMaterial}
        className="px-6 py-2 rounded-lg bg-blue-500 text-blue-600 font-semibold flex items-center gap-2 hover:bg-blue/90"
      >
         {loading ? <Spinner size={5} color="white" /> : <Upload size={16} /> }
      </Button>
    </div>
  </div>
</Modal>

      {/* Notifications Modal */}
      <Modal
  isOpen={showNotificationsModal}
  onClose={() => setShowNotificationsModal(false)}
  title="Notifications"
  size="md"
>
  <div className="max-h-[65vh] overflow-y-auto space-y-3 p-5 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 shadow-xl text-white">

    {notifications.length === 0 ? (
      <div className="p-6 text-center text-white/80 italic">
        No notifications yet ✨
      </div>
    ) : (
      notifications.map((n) => (
        <div
          key={n.id}
          className="p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white text-lg">{n.title}</div>
            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
              {new Date(n.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-2 text-sm text-white/90">{n.description}</div>

          <div className="mt-3 text-xs text-white/70 flex items-center gap-2">
            <span>🕒 {new Date(n.createdAt).toLocaleString()}</span>
            <span>•</span>
            <span>Expires: {new Date(n.expiresAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))
    )}
  </div>
</Modal>

      {/* AI Chat */}
      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </div>
  );
}
