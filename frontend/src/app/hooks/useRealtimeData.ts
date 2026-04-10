import { useState, useEffect, useMemo } from "react";
import { DataService } from "../services/DataService";

export function useRealtimeData<T>(getData: () => Promise<T>) {

  const [data, setData] = useState<T | any[]>([]);

  useEffect(() => {

    let mounted = true;

    const fetchData = async () => {
      try {

        const result = await getData();

        if (mounted) {
          setData(result || []);
        }

      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };

  }, []); // ✅ IMPORTANT: remove getData dependency

  return data;
}


/* ---------- COURSES ---------- */

export function useRealtimeCourses() {
  return useRealtimeData(() => DataService.getCourses());
}


/* ---------- PAYMENTS ---------- */

export function useRealtimePayments() {
  return useRealtimeData(() => DataService.getPayments());
}


/* ---------- USERS ---------- */

export function useRealtimeUsers() {
  return useRealtimeData(() => DataService.getUsers());
}


/* ---------- ENROLLMENTS ---------- */

export function useRealtimeEnrollments(userId: string | null) {
  return useRealtimeData(() =>
    userId ? DataService.getUserEnrollments(userId) : Promise.resolve([])
  );
}


/* ---------- ANALYTICS ---------- */

export function useRealtimeAnalytics() {

  const payments: any[] = useRealtimePayments() as any[];
  const courses: any[] = useRealtimeCourses() as any[];
  const users: any[] = useRealtimeUsers() as any[];

  const analytics = useMemo(() => {

    const totalRevenue = payments.reduce(
      (sum: number, p: any) => sum + Number(p.amount || 0),
      0
    );

    const revenueMap: any = {};

    payments.forEach((p: any) => {

      const month = p.date?.slice(0, 7);

      if (!month) return;

      if (!revenueMap[month]) revenueMap[month] = 0;

      revenueMap[month] += Number(p.amount || 0);

    });

    const revenue = Object.keys(revenueMap).map((month) => ({
      month,
      amount: revenueMap[month],
    }));


    const enrollMap: any = {};

    payments.forEach((p: any) => {

      const month = p.date?.slice(0, 7);

      if (!month) return;

      if (!enrollMap[month]) enrollMap[month] = 0;

      enrollMap[month] += 1;

    });

    const enrollments = Object.keys(enrollMap).map((month) => ({
      month,
      students: enrollMap[month],
    }));


    const topCourses = courses
      .map((course: any) => {

        const newEnrollments = payments.filter(
          (p: any) => p.courseId === course.id
        ).length;

        return {
          name: course.title,
          students: (course.studentsEnrolled || 0) + newEnrollments,
        };

      })
      .sort((a: any, b: any) => b.students - a.students)
      .slice(0, 5);


    return {
      totalCourses: courses.length,
      totalUsers: users.length,
      totalPayments: payments.length,
      revenueTotal: totalRevenue,
      revenue,
      enrollments,
      topCourses,
    };

  }, [payments, courses, users]);

  return analytics;
}