import { useParams, Link, useNavigate } from "react-router";
import { useRealtimeCourses } from "../hooks/useRealtimeData";
import { useAuth } from "../context/AuthContext";
import {
  Star,
  Users,
  Clock,
  PlayCircle,
  CheckCircle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const courses = useRealtimeCourses();

  const course = courses.find((c) => String(c.id) === String(id));

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl mb-4">Course not found</h1>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const isPurchased = user?.purchasedCourses?.includes(course.id) || false;
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0,
  );

  const handleEnroll = () => {
    if (!user) {
      toast.error("Please login to purchase this course");
      navigate("/login");
      return;
    }

    if (isPurchased) {
      navigate(`/learn/${course.id}`);
    } else {
      navigate(`/checkout/${course.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="text-sm text-blue-200 mb-2">
                {course.category}
              </div>
              <h1 className="text-3xl md:text-4xl mb-4">{course.title}</h1>
              <p className="text-xl text-blue-100 mb-6">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">
                    {course.rating > 0 ? course.rating : "New Course"}
                  </span>
                  {course.rating > 0 && (
                    <span className="text-blue-200">Rating</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {course.studentsEnrolled > 0
                      ? `${(course.studentsEnrolled || 0).toLocaleString()} students`
                      : "Be the first to enroll!"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  {course.instructor[0]}
                </div>
                <div>
                  <div className="text-sm text-blue-200">Instructor</div>
                  <div className="font-medium">{course.instructor}</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={
                    course.thumbnail || "https://via.placeholder.com/600x400"
                  }
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6">
                  <div className="text-3xl text-gray-900 mb-4">
                    ₹{(course.price || 0).toLocaleString()}
                  </div>
                  <button
                    onClick={handleEnroll}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mb-3"
                  >
                    {isPurchased ? "Start Learning" : "Buy Now"}
                  </button>
                  {!isPurchased && (
                    <p className="text-sm text-gray-500 text-center">
                      30-Day Money-Back Guarantee
                    </p>
                  )}
                  {isPurchased && (
                    <div className="flex items-center gap-2 text-green-600 justify-center">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">You own this course</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* What you'll learn */}
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
              <h2 className="text-2xl mb-4">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Master the fundamentals and advanced concepts
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Build real-world projects from scratch
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Get hands-on experience with industry tools
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Earn a certificate of completion
                  </span>
                </div>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl mb-4">Course Content</h2>
              <div className="mb-4 text-gray-600">
                {course.modules.length} modules • {totalLessons} lectures •{" "}
                {course.duration} total length
              </div>
              <div className="space-y-2">
                {course.modules.map((module, index) => (
                  <details key={module.id} className="group">
                    <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-500">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-gray-500">
                            {module.lessons.length} lectures
                          </div>
                        </div>
                      </div>
                      <PlayCircle className="w-5 h-5 text-gray-400" />
                    </summary>
                    <div className="mt-2 ml-4 space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 border-l-2 border-gray-200 hover:border-blue-500 transition"
                        >
                          <div className="flex items-center gap-3">
                            {lesson.isLocked && !isPurchased ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-blue-600" />
                            )}
                            <span className="text-sm text-gray-700">
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {lesson.duration}
                            </span>
                            {lesson.isLocked && !isPurchased && (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl mb-4">This course includes:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">
                    {course.duration} on-demand video
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Full lifetime access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">
                    Access on mobile and desktop
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">
                    Certificate of completion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
