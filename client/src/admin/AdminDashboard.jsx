import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
import {
  Menu,
  Users,
  Bell,
  FileText,
  ShieldCheck,
  Settings,
  Trash2,
  PlusCircle,
  BarChart3,
  Eye,
  Edit3,
  Search,
  Download,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../components/ui/Toast";
const API = `${import.meta.env.VITE_API_URL}/admin`;
const APP_API = `${import.meta.env.VITE_API_URL}/app`;

// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X size={20} />
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

function Sidebar({ open, setOpen }) {
  const links = [
    { name: "Overview", path: "/admin/overview", icon: <BarChart3 size={18} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Materials", path: "/admin/materials", icon: <FileText size={18} /> },
    { name: "Notifications", path: "/admin/notifications", icon: <Bell size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } fixed md:static md:translate-x-0 top-0 left-0 h-full w-72 max-w-[85vw] bg-gray-900 dark:bg-gray-950 text-white transition-transform duration-300 z-50`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <img src="/zanly-icon.jpg" alt="Zanly" className="w-8 h-8 rounded" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <button className="md:hidden" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors ${
                isActive ? "bg-gray-700 font-semibold" : ""
              }`
            }
            onClick={() => setOpen(false)}
          >
            {link.icon} {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

// ------------------ Overview Dashboard ------------------
function OverviewPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMaterials: 0,
    pendingMaterials: 0,
    totalNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, materialsRes, notificationsRes] = await Promise.all([
          axios.get(`${API}/users?limit=1`, { withCredentials: true }),
          axios.get(`${API}/materials?limit=1`, { withCredentials: true }),
          axios.get(`${APP_API}/notifications`, { withCredentials: true }),
        ]);

        const pendingMaterialsRes = await axios.get(
          `${API}/materials?status=PENDING&limit=1`,
          { withCredentials: true }
        );

        setStats({
          totalUsers: usersRes.data.total || 0,
          totalMaterials: materialsRes.data.total || 0,
          pendingMaterials: pendingMaterialsRes.data.total || 0,
          totalNotifications: notificationsRes.data.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Materials</p>
                <p className="text-3xl font-bold text-green-900">{stats.totalMaterials}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Pending Materials</p>
                <p className="text-3xl font-bold text-orange-900">{stats.pendingMaterials}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Active Notifications</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalNotifications}</p>
              </div>
              <Bell className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="flex items-center space-x-2" onClick={() => navigate('/admin/users')}>
              <Users size={16} />
              <span>Manage Users</span>
            </Button>
            <Button className="flex items-center space-x-2" onClick={() => navigate('/admin/materials')}>
              <FileText size={16} />
              <span>Review Materials</span>
            </Button>
            <Button className="flex items-center space-x-2" onClick={() => navigate('/admin/notifications')}>
              <Bell size={16} />
              <span>Send Notification</span>
            </Button>
            <Button variant="secondary" className="flex items-center space-x-2">
              <Download size={16} />
              <span>Export Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ------------------ Users Management ------------------

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");

  const getUsers = async (pageNum = 1, search = "", role = "") => {
    try {
      setLoading(true);
      let url = `${API}/users?page=${pageNum}&limit=10`;
      if (search) url += `&search=${search}`;
      if (role) url += `&role=${role}`;

      const res = await axios.get(url, { withCredentials: true });
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API}/user/${id}`, { withCredentials: true });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.patch(
        `${API}/user/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      getUsers(1, searchTerm, roleFilter);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, roleFilter]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h2>
        <Button
          variant="secondary"
          onClick={() => getUsers(page, searchTerm, roleFilter)}
          className="flex items-center space-x-2"
        >
          <RefreshCw size={16} /> <span>Refresh</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Users List */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-2 text-gray-500">Try adjusting your search.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="hover:shadow-md transition-shadow duration-300"
              >
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center space-x-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold overflow-hidden">
  {user?.image ? (
    <img
      src={user.image}
      alt="User"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <span className="text-lg">
      {user?.name?.charAt(0)?.toUpperCase() ||
        user?.email?.charAt(0)?.toUpperCase() ||
        "U"}
    </span>
  )}
</div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </h3>
                      <p className="text-gray-600 text-sm break-all">
                        {user.email}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit3 size={14} /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      className="flex-1"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => getUsers(page - 1, searchTerm, roleFilter)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page === totalPages}
                onClick={() => getUsers(page + 1, searchTerm, roleFilter)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <p className="text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <p className="text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <div className="space-y-2">
                {["USER", "ADMIN"].map((role) => (
                  <label key={role} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedUser.role === role}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          role: e.target.value,
                        })
                      }
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  updateUserRole(selectedUser.id, selectedUser.role)
                }
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ------------------ Materials Management ------------------
function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const getMaterials = async (pageNum = 1, status = "PENDING", search = "") => {
    try {
      setLoading(true);
      let url = `${API}/materials?page=${pageNum}&limit=10&status=${status}`;
      if (search) url += `&search=${search}`;
      const res = await axios.get(url, { withCredentials: true });
      setMaterials(res.data.materials || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch materials:", err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await axios.patch(`${API}/material/${id}/approve`, {}, { withCredentials: true });
      setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, status: "APPROVED" } : m)));
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const reject = async (id) => {
    try {
      await axios.patch(`${API}/material/${id}/reject`, {}, { withCredentials: true });
      setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, status: "REJECTED" } : m)));
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };

  const viewMaterial = async (materialId) => {
    try {
      const res = await axios.get(`${API}/material/${materialId}`, { withCredentials: true });
      setSelectedMaterial(res.data.material);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Failed to fetch material details:", err);
    }
  };

  useEffect(() => {
    getMaterials();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      getMaterials(1, statusFilter, searchTerm);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileTypeIcon = (fileType) => {
    if (fileType?.includes("pdf")) return "📄";
    if (fileType?.includes("image")) return "🖼️";
    if (fileType?.includes("video")) return "🎥";
    if (fileType?.includes("audio")) return "🎵";
    return "📦";
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Material Management
        </h2>
        <Button
          variant="secondary"
          onClick={() => getMaterials(page, statusFilter, searchTerm)}
          className="flex items-center space-x-2"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {/* Data Display */}
      {loading ? (
        <LoadingSpinner />
      ) : materials.length === 0 ? (
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No materials found</h3>
          <p className="mt-1 text-gray-500 text-sm">
            Try adjusting filters or search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material) => (
              <Card
                key={material.id}
                className="hover:shadow-lg transition-all duration-200 border border-gray-200"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{getFileTypeIcon(material.fileType)}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {material.title}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {material.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500 mb-3">
                      <span>📚 {material.subject}</span>
                      <span>🎓 Class {material.class}</span>
                      <span>📁 {material.type}</span>
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${getStatusColor(
                          material.status
                        )}`}
                      >
                        {material.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => viewMaterial(material.id)}
                      >
                        <Eye size={14} /> View
                      </Button>

                      {material.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approve(material.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => reject(material.id)}
                          >
                            <XCircle size={14} /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center flex-wrap gap-2 mt-6">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => getMaterials(page - 1, statusFilter, searchTerm)}
              >
                Previous
              </Button>
              <span className="text-gray-600 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                disabled={page === totalPages}
                onClick={() => getMaterials(page + 1, statusFilter, searchTerm)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Material Details"
      >
        {selectedMaterial && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedMaterial.title}
              </h3>
              <p className="text-gray-600">{selectedMaterial.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><strong>Subject:</strong> {selectedMaterial.subject}</div>
              <div><strong>Class:</strong> {selectedMaterial.class}</div>
              <div><strong>Type:</strong> {selectedMaterial.type}</div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                    selectedMaterial.status
                  )}`}
                >
                  {selectedMaterial.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => window.open(selectedMaterial.fileUrl, "_blank")}
              >
                <Download size={14} /> View File
              </Button>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ------------------ Notifications Management ------------------
function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const getNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${APP_API}/notifications`, { withCredentials: true });
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async () => {
    try {
      if (!title.trim() || !description.trim()) {
        alert("Please fill in both title and description");
        return;
      }
      
      setLoading(true);
      await axios.post(
        `${API}/notification/add`,
        { title, description },
        { withCredentials: true }
      );
      setTitle("");
      setDescription("");
      getNotifications();
    } catch (err) {
      console.error("Failed to add notification:", err);
    } finally {
      setLoading(false);
    }
  };

  const cleanup = async () => {
    if (!confirm("Are you sure you want to cleanup expired notifications?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API}/notification/remove`, { withCredentials: true });
      getNotifications();
    } catch (err) {
      console.error("Cleanup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Notification Management</h2>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={getNotifications} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button variant="danger" onClick={cleanup} disabled={loading}>
            <Trash2 size={16} /> Cleanup Expired
          </Button>
        </div>
      </div>

      {/* Add Notification Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send New Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter notification description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={addNotification} disabled={loading}>
            <PlusCircle size={16} /> {loading ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* Active Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Active Notifications ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner />
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No active notifications</h3>
              <p className="mt-2 text-gray-500">Send your first notification to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{notification.title}</h4>
                      <p className="text-gray-600 mt-1">{notification.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>📅 Created: {new Date(notification.createdAt).toLocaleDateString()}</span>
                        <span>⏰ Expires: {new Date(notification.expiresAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ------------------ Settings Page ------------------
function SettingsPage() {
  const {toast} = useToast()
const clearCache = async () => {
  try {
    const { data } = await axios.get(`${API}/clear/cache`, {
      withCredentials: true,
    });

    toast.success(data?.message || "Cache cleared successfully!");
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Failed to clear cache. Please try again.";
    toast.error(msg);
  }
};

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Application:</span> Zanly Study Materials
            </div>
             <div>
              <span className="font-medium">Founder:</span> <a href="https://faizcasm.in">Faizan Hameed</a>
            </div>
            <div>
              <span className="font-medium">Version:</span> 1.0.0
            </div>
            <div>
              <span className="font-medium">Environment:</span> Production
            </div>
            <div>
              <span className="font-medium">Database:</span> PostgreSQL
            </div>
             <div>
              <span className="font-medium">Cache Database:</span> Redis
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="secondary">
              <Download size={16} /> Export User Data
            </Button>
            <Button variant="secondary">
              <Download size={16} /> Export Material Data
            </Button>
            <Button variant="secondary" onClick={clearCache}>
              <RefreshCw size={16} /> Clear Cache
            </Button>
            <Button variant="secondary">
              <Settings size={16} /> System Maintenance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ------------------ Admin Dashboard ------------------
function AdminDashboard() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const {user} = useAuth()
  const notificationsnavigate =()=>{
    navigate('/admin/notifications')
  }
  const toProfile = ()=>{
   navigate('/profile')
  }
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar open={open} setOpen={setOpen} />
      {/* Backdrop for mobile when sidebar is open */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} />
      )}
      <div className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100" 
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Zanly Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" onClick={notificationsnavigate}/>
            </Button>
           <div
  onClick={toProfile}
  className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold cursor-pointer"
>
  {user?.image ? (
    <img
      src={user.image}
      alt="profile"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <span className="text-sm">
      {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
    </span>
  )}
</div>

          </div>
        </header>
        <main>
          <Routes>
            <Route path="overview" element={<OverviewPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<OverviewPage />} /> {/* default */}
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard
