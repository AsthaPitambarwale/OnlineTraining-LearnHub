import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DataService } from "../services/DataService";

interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
  purchasedCourses: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  purchaseCourse: (courseId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* RESTORE SESSION */
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  /* LOGIN */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {

      // ADMIN LOGIN
      if (email === "admin@platform.com" && password === "admin123") {

        const adminUser: User = {
          id: "admin-1",
          email,
          name: "Admin User",
          role: "admin",
          purchasedCourses: [],
        };

        setUser(adminUser);
        localStorage.setItem("currentUser", JSON.stringify(adminUser));

        return true;
      }

      const users = await DataService.getUsers();

      const existingUser = users.find(
        (u: any) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );

      if (!existingUser) return false;

      const enrollments = await DataService.getUserEnrollments(existingUser.id);

      const loginUser: User = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        purchasedCourses: enrollments.map((e: any) => e.courseId),
      };

      setUser(loginUser);
      localStorage.setItem("currentUser", JSON.stringify(loginUser));

      return true;

    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  /* SIGNUP */
  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {

    try {

      if (password.length < 6 || !email.includes("@")) {
        return false;
      }

      const newUser = await DataService.addUser({
        name,
        email,
        password,
        role: "student",
      });

      const createdUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: "student",
        purchasedCourses: [],
      };

      setUser(createdUser);
      localStorage.setItem("currentUser", JSON.stringify(createdUser));

      return true;

    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  /* LOGOUT */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  /* PURCHASE COURSE */
  const purchaseCourse = (courseId: string) => {

    if (!user) return;

    const updatedUser: User = {
      ...user,
      purchasedCourses: [...user.purchasedCourses, courseId],
    };

    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, purchaseCourse }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}