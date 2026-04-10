import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { DataService } from "../services/DataService";
import { Module, Lesson } from "../data/mockData";
import {
  useRealtimeCourses,
  useRealtimePayments,
  useRealtimeUsers,
  useRealtimeAnalytics,
} from "../hooks/useRealtimeData";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Video,
  Save,
  X,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

type Tab = "overview" | "courses" | "users" | "payments" | "analytics";

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [showVideoManagerModal, setShowVideoManagerModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage your online training platform
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === "courses"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === "users"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === "payments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "courses" && (
          <CoursesTab
            onAddCourse={() => setShowAddCourseModal(true)}
            onEditCourse={(id) => {
              setEditingCourseId(id);
              setShowEditCourseModal(true);
            }}
            onManageVideos={(id) => {
              setEditingCourseId(id);
              setShowVideoManagerModal(true);
            }}
          />
        )}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <CourseFormModal
          onClose={() => setShowAddCourseModal(false)}
          onSave={() => {
            toast.success("Course added successfully!");
            setShowAddCourseModal(false);
          }}
        />
      )}

      {/* Edit Course Modal */}
      {showEditCourseModal && editingCourseId && (
        <CourseFormModal
          courseId={editingCourseId}
          onClose={() => {
            setShowEditCourseModal(false);
            setEditingCourseId(null);
          }}
          onSave={() => {
            toast.success("Course updated successfully!");
            setShowEditCourseModal(false);
            setEditingCourseId(null);
          }}
        />
      )}

      {/* Video Manager Modal */}
      {showVideoManagerModal && editingCourseId && (
        <VideoManagerModal
          courseId={editingCourseId}
          onClose={() => {
            setShowVideoManagerModal(false);
            setEditingCourseId(null);
          }}
        />
      )}
    </div>
  );
}

function OverviewTab() {
  const payments = useRealtimePayments();
  const users = useRealtimeUsers();
  const courses = useRealtimeCourses();

  const totalRevenue = payments.reduce((acc, p) => acc + p.amount || 0, 0);
  const totalStudents = users.length;
  const totalCourses = courses.length;

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <div className="text-sm text-gray-600">Active Courses</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{payments.length}</div>
              <div className="text-sm text-gray-600">Total Enrollments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <div className="font-medium">{payment.userName}</div>
                  <div className="text-sm text-gray-600">
                    {payment.courseTitle}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    ₹{(payment.amount || 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{payment.date}</div>
                </div>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-gray-500 text-center py-4">No payments yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl mb-4">Popular Courses</h3>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{course.title}</div>
                  <div className="text-sm text-gray-600">
                    {course.instructor}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {course.studentsEnrolled > 0
                    ? `${course.studentsEnrolled} students`
                    : "No enrollments yet"}
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-gray-500 text-center py-4">No courses yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesTab({
  onAddCourse,
  onEditCourse,
  onManageVideos,
}: {
  onAddCourse: () => void;
  onEditCourse: (id: string) => void;
  onManageVideos: (id: string) => void;
}) {
  const courses = useRealtimeCourses();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      DataService.deleteCourse(id);
      toast.success("Course deleted successfully!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl">Manage Courses</h2>
        <button
          onClick={onAddCourse}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Course
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{course.title}</div>
                  <div className="text-sm text-gray-600">
                    {course.instructor}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {course.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  ₹{(course.price || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {course.studentsEnrolled > 0
                    ? course.studentsEnrolled.toLocaleString()
                    : "0"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onManageVideos(course.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                      title="Manage Videos"
                    >
                      <Video className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditCourse(course.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No courses yet. Click "Add Course" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UsersTab() {
  const users = useRealtimeUsers();

  return (
    <div>
      <h2 className="text-2xl mb-6">Manage Users</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Courses
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Join Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{user.name}</td>

                <td className="px-6 py-4 text-gray-600">{user.email}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">{user.courses || 0}</td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(Number(user.id)).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No users yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentsTab() {
  const payments = useRealtimePayments();
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl mb-2">Payment History</h2>
        <div className="text-xl text-green-600 font-medium">
          Total Revenue: ₹{totalRevenue.toLocaleString()}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">{payment.id}</td>
                <td className="px-6 py-4">{payment.userName}</td>
                <td className="px-6 py-4 text-gray-600">
                  {payment.courseTitle}
                </td>
                <td className="px-6 py-4 font-medium">
                  ₹{(payment.amount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-600">{payment.date}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No payments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const analyticsData = useRealtimeAnalytics();

  return (
    <div>
      <h2 className="text-2xl mb-6">Analytics & Reports</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl mb-4">Monthly Enrollments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.enrollments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl mb-4">Top Courses by Enrollment</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.topCourses} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CourseFormModal({
  courseId,
  onClose,
  onSave,
}: {
  courseId?: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const courses = useRealtimeCourses();
  const course = courseId ? courses.find((c) => c.id === courseId) : null;

  const [formInitialized, setFormInitialized] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [instructor, setInstructor] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [thumbnail, setThumbnail] = useState("");

  const [thumbnailInputType, setThumbnailInputType] = useState<
    "url" | "upload"
  >("url");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("");
  const [studentsEnrolled, setStudentsEnrolled] = useState("");

  /**
   * Initialize form when editing
   * Prevents realtime refresh from overwriting input
   */
  useEffect(() => {
    if (courseId && !course) return;

    if (course && !formInitialized) {
      setTitle(course.title || "");
      setDescription(course.description || "");
      setPrice(course.price?.toString() || "");
      setInstructor(course.instructor || "");
      setCategory(course.category || "Web Development");
      setThumbnail(course.thumbnail || "");
      setThumbnailPreview(course.thumbnail || "");
      setDuration(course.duration || "");
      setRating(course.rating?.toString() || "");
      setStudentsEnrolled(course.studentsEnrolled?.toString() || "");

      setFormInitialized(true);
    }

    if (!courseId && !formInitialized) {
      setTitle("");
      setDescription("");
      setPrice("");
      setInstructor("");
      setCategory("Web Development");
      setThumbnail("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setDuration("");
      setRating("");
      setStudentsEnrolled("");
      setThumbnailInputType("url");

      setFormInitialized(true);
    }
  }, [courseId, course, formInitialized]);

  /** Handle thumbnail file upload */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setThumbnailFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result as string;

      setThumbnailPreview(result);
      setThumbnail(result);
    };

    reader.readAsDataURL(file);
  };

  /** Handle thumbnail URL */
  const handleUrlChange = (url: string) => {
    setThumbnail(url);
    setThumbnailPreview(url);
  };

  /** Submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        description,
        price: Number(price) || 0,
        instructor,
        category,
        thumbnail,
        duration,
        rating: Number(rating) || 0,
        studentsEnrolled: Number(studentsEnrolled) || 0,
      };

      if (courseId) {
        await DataService.updateCourse(courseId, payload);
      } else {
        await DataService.addCourse({
          ...payload,
          modules: [],
        });
      }

      onSave();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save course");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl">
            {courseId ? "Edit Course" : "Add New Course"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Complete Web Development Bootcamp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what students will learn..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="4999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="40 hours"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Web Development</option>
              <option>Data Science</option>
              <option>Marketing</option>
              <option>Design</option>
              <option>Mobile Development</option>
              <option>Cloud Computing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor Name
            </label>
            <input
              type="text"
              required
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Sarah Johnson"
            />
          </div>

          {/* Thumbnail Section with URL or Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>

            {/* Toggle buttons */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setThumbnailInputType("url");
                  setThumbnailFile(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  thumbnailInputType === "url"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                Enter URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setThumbnailInputType("upload");
                  setThumbnail("");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  thumbnailInputType === "upload"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
            </div>

            {/* URL Input */}
            {thumbnailInputType === "url" && (
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg or https://images.unsplash.com/..."
              />
            )}

            {/* File Upload */}
            {thumbnailInputType === "upload" && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-600"
                  id="thumbnail-upload"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Supports: JPG, PNG, GIF, WebP (Max 5MB recommended)
                </p>
              </div>
            )}

            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={() => {
                      setThumbnailPreview("");
                      toast.error(
                        "Failed to load image. Please check the URL or try another image.",
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="4.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Students Enrolled
              </label>
              <input
                type="number"
                min="0"
                value={studentsEnrolled}
                onChange={(e) => setStudentsEnrolled(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Video className="w-5 h-5" />
              <span>
                Add course videos and modules using the "Manage Videos" button
                after {courseId ? "updating" : "creating"} the course
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {courseId ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VideoManagerModal({
  courseId,
  onClose,
}: {
  courseId: string;
  onClose: () => void;
}) {
  const courses = useRealtimeCourses();
  const course = courses.find((c) => c.id === courseId);

  const [modules, setModules] = useState<Module[]>([]);
  const [modulesInitialized, setModulesInitialized] = useState(false);

  useEffect(() => {
    if (course && !modulesInitialized) {
      setModules(course.modules || []);
      setModulesInitialized(true);
    }
  }, [course, modulesInitialized]);

  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [newModuleName, setNewModuleName] = useState("");

  const [editingLessonModuleId, setEditingLessonModuleId] = useState<
    string | null
  >(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState("");
  const [newLessonUrl, setNewLessonUrl] = useState("");

  const handleAddModule = () => {
    if (!newModuleName.trim()) return;

    const newModule: Module = {
      id: `m_${Date.now()}`,
      title: newModuleName.trim(),
      lessons: [],
    };

    setModules((prev) => [...prev, newModule]);

    setNewModuleName("");
    setEditingModuleId(null);
  };

  const handleAddLesson = (moduleId: string) => {
    if (
      newLessonTitle.trim() &&
      newLessonUrl.trim() &&
      newLessonDuration.trim()
    ) {
      const newLesson: Lesson = {
        id: `l_${Date.now()}`,
        title: newLessonTitle.trim(),
        duration: newLessonDuration.trim(),
        videoUrl: newLessonUrl.trim(),
        isLocked: true,
      };

      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m,
        ),
      );

      setNewLessonTitle("");
      setNewLessonDuration("");
      setNewLessonUrl("");
      setEditingLessonModuleId(null);
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm("Delete this module and all its lessons?")) {
      setModules((prev) => prev.filter((m) => m.id !== moduleId));
    }
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m,
      ),
    );
  };

  const handleSave = async () => {
    if (!course) return;

    try {
      await DataService.updateCourse(courseId, {
        title: course.title,
        description: course.description,
        price: course.price,
        instructor: course.instructor,
        category: course.category,
        thumbnail: course.thumbnail,
        duration: course.duration,
        rating: course.rating,
        studentsEnrolled: course.studentsEnrolled,
        modules: modules,
      });

      toast.success("Modules saved successfully");

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Failed to save modules");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl">Manage Videos</h2>
            <p className="text-sm text-gray-600 mt-1">{course?.title}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Video URL Sources:</strong> You can add video URLs from
              AWS S3, Vimeo, YouTube, or any other video hosting platform.
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-lg">{module.title}</h3>

                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white rounded p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {lesson.title}
                        </div>

                        <div className="text-xs text-gray-500">
                          Duration: {lesson.duration} | URL:{" "}
                          {lesson.videoUrl.substring(0, 50)}...
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteLesson(module.id, lesson.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {editingLessonModuleId === module.id ? (
                  <div className="bg-white rounded-lg p-3 space-y-2">
                    <input
                      type="text"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Lesson title"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newLessonDuration}
                        onChange={(e) => setNewLessonDuration(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Duration (10:30)"
                      />

                      <input
                        type="text"
                        value={newLessonUrl}
                        onChange={(e) => setNewLessonUrl(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm"
                        placeholder="Video URL"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddLesson(module.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm"
                      >
                        Add Lesson
                      </button>

                      <button
                        onClick={() => setEditingLessonModuleId(null)}
                        className="px-3 py-2 border rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingLessonModuleId(module.id)}
                    className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600"
                  >
                    + Add Lesson to this Module
                  </button>
                )}
              </div>
            ))}

            {editingModuleId ? (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <input
                  type="text"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Module name"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleAddModule}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Add Module
                  </button>

                  <button
                    onClick={() => {
                      setEditingModuleId(null);
                      setNewModuleName("");
                    }}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setEditingModuleId("new")}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Module
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
