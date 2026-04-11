const API = import.meta.env.VITE_API_URL;

type Listener = () => void;

export class DataService {
  static listeners: { [key: string]: Listener[] } = {};

  // SUBSCRIPTIONS
  static subscribe(key: string, callback: Listener) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }

    this.listeners[key].push(callback);

    return () => {
      this.listeners[key] = this.listeners[key].filter((cb) => cb !== callback);
    };
  }

  static notify(key: string) {
    if (!this.listeners[key]) return;
    this.listeners[key].forEach((cb) => cb());
  }

  // ================= COURSES =================
  static async getCourses() {
    const res = await fetch(`${API}/courses`);
    return res.json();
  }

  static async addCourse(course: any) {
    const res = await fetch(`${API}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });

    this.notify("courses");
    return res.json();
  }

  static async updateCourse(id: string, course: any) {
    const res = await fetch(`${API}/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });

    this.notify("courses");
    return res.json();
  }

  static async deleteCourse(id: string) {
    await fetch(`${API}/courses/${id}`, {
      method: "DELETE",
    });

    this.notify("courses");
  }

  // ================= MODULES =================
  static async updateModules(courseId: string, modules: any[]) {
    const res = await fetch(`${API}/courses/${courseId}/modules`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modules }),
    });

    this.notify("courses");
    return res.json();
  }

  // ================= USERS =================
  static async getUsers() {
    const res = await fetch(`${API}/users`);
    return res.json();
  }

  static async addUser(user: any) {
    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    this.notify("users");
    return res.json();
  }

  static async deleteUser(id: string) {
    await fetch(`${API}/users/${id}`, {
      method: "DELETE",
    });

    this.notify("users");
  }

  // ================= PAYMENTS =================

  static async getPayments() {
    const res = await fetch(`${API}/payments`);
    return res.json();
  }

  // ================= ENROLLMENTS =================
  static async getEnrollments() {
    const res = await fetch(`${API}/enrollments`);
    return res.json();
  }

  static async getUserEnrollments(userId: string) {
    const res = await fetch(`${API}/enrollments/${userId}`);
    return res.json();
  }

  static async enrollUser(data: any) {
    const res = await fetch(`${API}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    this.notify("enrollments");
    return res.json();
  }

  // ================= PROGRESS =================
  static async getCourseProgress(userId: string, courseId: string) {
    const res = await fetch(`${API}/progress/${userId}/${courseId}`);
    if (!res.ok) return null;
    return res.json();
  }

  static async markLessonComplete(
    userId: string,
    courseId: string,
    lessonId: string,
  ) {
    const res = await fetch(`${API}/progress/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        courseId,
        lessonId,
      }),
    });

    const data = await res.json();
    this.notify("progress");
    return data;
  }

  static async updateLastAccessedLesson(
    userId: string,
    courseId: string,
    lessonId: string,
  ) {
    await fetch(`${API}/progress/last-accessed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        courseId,
        lessonId,
      }),
    });

    this.notify("progress");
  }

  static async calculateProgress(userId: string, courseId: string) {
    const progress = await this.getCourseProgress(userId, courseId);
    if (!progress) return 0;

    const completedLessons = progress.completedLessons?.length || 0;

    const courses = await this.getCourses();
    const course = courses.find((c: any) => String(c.id) === String(courseId));

    if (!course) return 0;

    const modules =
      typeof course.modules === "string"
        ? JSON.parse(course.modules)
        : course.modules || [];

    const totalLessons = modules.reduce(
      (total: number, module: any) => total + (module.lessons?.length || 0),
      0,
    );

    if (totalLessons === 0) return 0;

    return Math.round((completedLessons / totalLessons) * 100);
  }

  // ================= ANALYTICS =================
  static async getAnalytics() {
    const [courses, users, payments] = await Promise.all([
      this.getCourses(),
      this.getUsers(),
      this.getPayments(),
    ]);

    const totalRevenue = payments.reduce(
      (sum: number, p: any) => sum + Number(p.amount || 0),
      0,
    );

    return {
      totalCourses: courses.length,
      totalUsers: users.length,
      totalPayments: payments.length,
      revenue: totalRevenue,
    };
  }
}
