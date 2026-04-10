import { useState, useEffect } from "react";
import { DataService } from "../services/DataService";

export function useProgress(userId: string | undefined) {
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const [percentMap, setPercentMap] = useState<Record<string, number>>({});
  const [version, setVersion] = useState(0); // forces UI refresh

  /* LOAD PROGRESS FROM BACKEND */
  const loadProgress = async () => {
    if (!userId) return;

    try {
      const enrollments = await DataService.getUserEnrollments(userId);

      const newProgress: Record<string, any> = {};
      const newPercent: Record<string, number> = {};

      await Promise.all(
        enrollments.map(async (enrollment: any) => {
          const courseId = enrollment.courseId;

          const progress = await DataService.getCourseProgress(
            userId,
            courseId,
          );

          const percent = await DataService.calculateProgress(userId, courseId);

          newProgress[courseId] = progress;
          newPercent[courseId] = percent;
        }),
      );

      setProgressMap(newProgress);
      setPercentMap(newPercent);

      // force UI update
      setVersion((v) => v + 1);
    } catch (err) {
      console.error("Progress load error:", err);
    }
  };

  /* INITIAL LOAD */

  useEffect(() => {
    loadProgress();

    const unsubscribe = DataService.subscribe("progress", () => {
      loadProgress();
    });

    return unsubscribe;
  }, [userId]);

  /* MANUAL REFRESH */

  const refreshProgress = async () => {
    await loadProgress();
  };

  /* MARK LESSON COMPLETE */

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    if (!userId) return;

    try {
      await DataService.markLessonComplete(userId, courseId, lessonId);

      await loadProgress(); // reload progress
    } catch (err) {
      console.error("Lesson completion failed:", err);
    }
  };

  /* UPDATE LAST ACCESSED */

  const updateLastAccessed = async (courseId: string, lessonId: string) => {
    if (!userId) return;

    try {
      await DataService.updateLastAccessedLesson(userId, courseId, lessonId);
    } catch (err) {
      console.error("Last accessed update failed:", err);
    }
  };

  /* CHECK IF LESSON COMPLETED */

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    const progress = progressMap[courseId];

    if (!progress?.completedLessons) return false;

    return progress.completedLessons.some(
      (id: string) => String(id) === String(lessonId),
    );
  };

  /* GET COURSE PROGRESS */

  const getProgress = (courseId: string) => {
    return percentMap[courseId] || 0;
  };

  /* GET COURSE PROGRESS DATA */

  const getCourseProgress = (courseId: string) => {
    return progressMap[courseId] || null;
  };

  /* COMPLETED COURSES COUNT */

  const getCompletedCoursesCount = () => {
    return Object.values(percentMap).filter((p) => p === 100).length;
  };

  return {
    getProgress,
    getCourseProgress,
    isLessonCompleted,
    markLessonComplete,
    updateLastAccessed,
    refreshProgress,
    getCompletedCoursesCount,
    version, // used to trigger UI updates
  };
}
