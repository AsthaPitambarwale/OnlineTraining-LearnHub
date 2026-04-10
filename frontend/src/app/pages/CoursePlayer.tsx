import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useRealtimeCourses } from "../hooks/useRealtimeData";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../hooks/useProgress";
import { ChevronLeft, PlayCircle, CheckCircle, Award } from "lucide-react";
import { toast } from "sonner";
import YouTube from "react-youtube";

export function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const courses = useRealtimeCourses();
  const progress = useProgress(user?.id);

  const [showSidebar] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [videoWatched, setVideoWatched] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  const completionTriggered = useRef(false);

  const course = courses.find((c) => String(c.id) === String(id));

  const modules =
    typeof course?.modules === "string"
      ? JSON.parse(course.modules)
      : course?.modules || [];

  /* AUTH + ACCESS CHECK */

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!courses.length) return;

    if (!course) {
      navigate(`/courses/${id}`);
      return;
    }

    if (!user.purchasedCourses?.includes(course.id)) {
      navigate(`/courses/${id}`);
      return;
    }

    if (!selectedLesson && modules?.[0]?.lessons?.[0]) {
      setSelectedLesson(modules[0].lessons[0].id);
    }
  }, [user, course?.id, courses.length]);

  /* LESSON CHANGE */

  useEffect(() => {
    if (!selectedLesson || !course || !user) return;

    completionTriggered.current = false;

    const isCompleted = progress.isLessonCompleted(course.id, selectedLesson);

    setVideoWatched(isCompleted);

    setWatchTime(0); // reset watch timer for new lesson

    progress.updateLastAccessed(course.id, selectedLesson);
  }, [selectedLesson]);

  // Watch Time
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* VIDEO COMPLETION */

  const handleVideoComplete = async () => {
    console.log("COMPLETION TRIGGERED");

    if (!course || !user || !selectedLesson) return;

    if (completionTriggered.current) return;

    completionTriggered.current = true;

    try {
      // Mark lesson completed
      await progress.markLessonComplete(course.id, selectedLesson);

      // 🔥 SAVE WATCH TIME
      await fetch("http://localhost:5000/progress/watch-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          courseId: course.id,
          seconds: watchTime,
        }),
      });

      // 🔥 FORCE PROGRESS REFRESH
      await progress.refreshProgress();

      toast.success("Lesson completed 🎉");

      setTimeout(() => {
        const percent = progress.getProgress(course.id);

        console.log("NEW PROGRESS:", percent);

        if (percent === 100) {
          setShowCongrats(true);
          toast.success("Course completed 🏆");
        }
      }, 300);
    } catch (err) {
      console.error("Completion failed", err);
    }
  };

  /* BUILD LESSON LIST */

  const allLessons = modules.flatMap((module: any) =>
    module.lessons.map((lesson: any) => ({
      ...lesson,
      moduleTitle: module.title,
    })),
  );

  const currentLesson = allLessons.find((l) => l.id === selectedLesson);
  const currentIndex = allLessons.findIndex((l) => l.id === selectedLesson);

  const courseProgressPercentage =
    progress.getProgress(course?.id) + progress.version * 0;

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1) {
      setSelectedLesson(allLessons[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedLesson(allLessons[currentIndex - 1].id);
    }
  };

  const isYoutube =
    currentLesson?.videoUrl?.includes("youtube") ||
    currentLesson?.videoUrl?.includes("youtu.be");

  if (!user || !course) return null;

  const getYoutubeId = (url: string) => {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };

  return (
    <>
      <div className="h-[calc(100vh-4rem)] flex bg-gray-900">
        {/* SIDEBAR */}

        <motion.div
          className="bg-white overflow-hidden"
          animate={{ width: showSidebar ? 320 : 0 }}
        >
          <div className="p-4 border-b">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600"
            >
              <ChevronLeft /> Back
            </button>

            <h2 className="mt-3">{course.title}</h2>

            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{courseProgressPercentage}%</span>
              </div>

              <div className="bg-gray-200 h-2 rounded-full mt-1">
                <motion.div
                  key={courseProgressPercentage}
                  className="bg-blue-600 h-2 rounded-full"
                  animate={{ width: `${courseProgressPercentage}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>

          <div className="overflow-y-auto h-full">
            {modules.map((module: any) => (
              <div key={module.id}>
                <div className="p-3 bg-gray-50 font-medium">{module.title}</div>

                {module.lessons.map((lesson: any) => {
                  const isCompleted = progress.isLessonCompleted(
                    course.id,
                    lesson.id,
                  );

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson.id)}
                      className="w-full p-3 flex items-center gap-2 hover:bg-gray-50"
                    >
                      {isCompleted ? (
                        <CheckCircle className="text-green-600" />
                      ) : (
                        <PlayCircle />
                      )}

                      {lesson.title}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* VIDEO PLAYER */}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black flex items-center justify-center">
            {currentLesson ? (
              isYoutube ? (
                <YouTube
                  key={currentLesson.id}
                  videoId={getYoutubeId(currentLesson.videoUrl)}
                  className="w-full max-w-6xl mx-auto"
                  iframeClassName="w-full aspect-video"
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 0,
                      controls: 1,
                      rel: 0,
                      modestbranding: 1,
                    },
                  }}
                  onEnd={() => {
                    console.log("VIDEO ENDED");
                    handleVideoComplete();
                  }}
                />
              ) : (
                <video
                  key={currentLesson.id}
                  className="w-full max-w-5xl"
                  controls
                  onEnded={handleVideoComplete}
                >
                  <source src={currentLesson.videoUrl} type="video/mp4" />
                </video>
              )
            ) : (
              <div className="text-white">Select lesson</div>
            )}
          </div>

          <div className="bg-white p-4 flex justify-between">
            <button onClick={handlePrevious}>Previous</button>

            <span>
              Lesson {currentIndex + 1} / {allLessons.length}
            </span>

            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      </div>

      {/* COURSE COMPLETED MODAL */}

      {showCongrats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl text-center">
            <Award className="mx-auto mb-3 text-yellow-500" size={60} />

            <h2 className="text-2xl mb-4">Course Completed 🎉</h2>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              Go Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}
