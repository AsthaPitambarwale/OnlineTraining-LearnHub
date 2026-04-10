import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../hooks/useProgress";
import { BookOpen, PlayCircle, Clock, Trophy } from "lucide-react";
import { generateCertificate } from "../utils/generateCertificate";
import { DataService } from "../services/DataService";

export function StudentDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const progress = useProgress(user?.id);

  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);

  /* LOAD COURSES + USER ENROLLMENTS */

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        const coursesData = await DataService.getCourses();
        const userEnrollments = await DataService.getUserEnrollments(user.id);

        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setEnrollments(Array.isArray(userEnrollments) ? userEnrollments : []);
      } catch (err) {
        console.error("Failed loading dashboard", err);
        setCourses([]);
        setEnrollments([]);
      }
    }

    loadData();
  }, [user]);

  /* REDIRECT IF NOT LOGGED IN */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  /* MATCH COURSES WITH USER ENROLLMENTS */

  const enrolledCourses = courses.filter((course) =>
    enrollments.some((e) => e.courseId === course.id),
  );

  /* LOAD COMPLETED COURSES */

  useEffect(() => {
    if (!user) return;

    let completed = 0;

    enrolledCourses.forEach((course) => {
      let modules = [];

      try {
        modules =
          typeof course.modules === "string"
            ? JSON.parse(course.modules)
            : course.modules || [];
      } catch {
        modules = [];
      }

      const totalLessons = modules.reduce(
        (sum: number, m: any) => sum + (m?.lessons?.length || 0),
        0,
      );

      const completedLessons =
        progress.getCourseProgress(course.id)?.completedLessons?.length || 0;

      if (totalLessons > 0 && completedLessons === totalLessons) {
        completed++;
      }
    });

    setCompletedCoursesCount(completed);
  }, [enrolledCourses, progress, user]);

  if (!user) return null;

  /* TOTAL LESSONS */

  const totalLessons = enrolledCourses.reduce((acc, c) => {
    let modules = [];

    try {
      modules =
        typeof c.modules === "string" ? JSON.parse(c.modules) : c.modules || [];
    } catch {
      modules = [];
    }

    return (
      acc +
      modules.reduce((a: number, m: any) => a + (m?.lessons?.length || 0), 0)
    );
  }, 0);

  /* COMPLETED LESSONS */

  const completedLessons = enrolledCourses.reduce((acc, course) => {
    const courseProgress = progress.getCourseProgress(course.id);
    return acc + (courseProgress?.completedLessons?.length || 0);
  }, 0);

  /* COURSES IN PROGRESS */

  const inProgressCourses = enrolledCourses.filter((course) => {
    const courseProgress = progress.getCourseProgress(course.id);

    const completedLessons = courseProgress?.completedLessons?.length || 0;

    let modules = [];

    try {
      modules =
        typeof course.modules === "string"
          ? JSON.parse(course.modules)
          : course.modules || [];
    } catch {
      modules = [];
    }

    const totalLessons = modules.reduce(
      (sum: number, m: any) => sum + (m?.lessons?.length || 0),
      0,
    );

    return completedLessons > 0 && completedLessons < totalLessons;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl mb-2">My Learning</h1>
          <p className="text-xl text-gray-600">Welcome back, {user.name}</p>
        </motion.div>

        {/* STATS */}

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">
                  {enrolledCourses.length}
                </div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <PlayCircle className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {completedLessons}/{totalLessons}
                </div>
                <div className="text-sm text-gray-600">Lessons Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">{inProgressCourses}</div>
                <div className="text-sm text-gray-600">Courses In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {completedCoursesCount}
                </div>
                <div className="text-sm text-gray-600">Certificates</div>
              </div>
            </div>
          </div>
        </div>

        {/* COURSE LIST */}

        {enrolledCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              let modules = [];

              try {
                modules =
                  typeof course.modules === "string"
                    ? JSON.parse(course.modules)
                    : course.modules || [];
              } catch {
                modules = [];
              }

              const totalLessons = modules.reduce(
                (acc: number, m: any) => acc + (m?.lessons?.length || 0),
                0,
              );

              const completedLessons =
                progress.getCourseProgress(course.id)?.completedLessons
                  ?.length || 0;

              const courseProgress =
                totalLessons === 0
                  ? 0
                  : Math.round((completedLessons / totalLessons) * 100);

              const isCompleted = completedLessons >= totalLessons;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl mb-2">{course.title}</h3>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{courseProgress}%</span>
                      </div>

                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${courseProgress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg"
                    >
                      {isCompleted ? "Review Course" : "Continue Learning"}
                    </button>

                    {isCompleted && (
                      <button
                        onClick={() =>
                          generateCertificate(user.name, course.title)
                        }
                        className="mt-2 w-full py-2 border border-green-600 text-green-600 rounded-lg"
                      >
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <h3 className="text-2xl mb-2">No Courses Yet</h3>

            <Link
              to="/courses"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
