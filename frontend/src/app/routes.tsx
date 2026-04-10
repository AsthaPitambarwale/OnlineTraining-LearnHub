import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { CourseList } from "./pages/CourseList";
import { CourseDetails } from "./pages/CourseDetails";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Checkout } from "./pages/Checkout";
import { StudentDashboard } from "./pages/StudentDashboard";
import { CoursePlayer } from "./pages/CoursePlayer";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "courses", Component: CourseList },
      { path: "courses/:id", Component: CourseDetails },
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "checkout/:id", Component: Checkout },
      { path: "dashboard", Component: StudentDashboard },
      { path: "learn/:id", Component: CoursePlayer },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
