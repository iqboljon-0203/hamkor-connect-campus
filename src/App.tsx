import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuthStore } from "./store/authStore";
import { ThemeProvider } from "@/providers/ThemeProvider";
import AppRoutes from "./routes";
import { GroupModalProvider } from "@/providers/GroupModalProvider";

// Layouts
import DashboardLayout from "./components/layouts/DashboardLayout";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";

// Shared pages
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Calendar from "./pages/teacher/Calendar";
import TeacherGroups from "./pages/teacher/TeacherGroups";
import StudentTasks from "./pages/student/StudentTasks";
import TeacherAnswers from "./pages/teacher/TeacherAnswers";
import StudentGroups from "./pages/student/StudentGroups";
import StudentGroupTasks from "./pages/student/StudentGroupTasks";
import StudentCalendar from "./pages/student/StudentCalendar";
import TeacherTasks from "./pages/teacher/TeacherTasks";
import StudentGrades from "./pages/student/StudentGrades";
import AddTask from "./pages/teacher/AddTask";
import GroupDetails from "./pages/teacher/GroupDetails";
import Home from "./pages/Home";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"}
      />
    );
  }

  return <>{children}</>;
};

// Auth layout wrapper
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role } = useAuthStore();

  if (isAuthenticated && role) {
    return (
      <Navigate
        to={role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"}
      />
    );
  }

  return <>{children}</>;
};

const App = () => (
  <ThemeProvider>
    <GroupModalProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />

              <Routes>
                {/* Auth Routes */}
                <Route
                  path="/auth/login"
                  element={
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  }
                />
                <Route
                  path="/auth/register"
                  element={
                    <AuthLayout>
                      <Register />
                    </AuthLayout>
                  }
                />

                {/* Home Route */}
                <Route path="/" element={<Home />} />

                {/* Teacher Dashboard Routes */}
                <Route
                  path="/teacher-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["teacher"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<TeacherDashboard />} />
                  <Route path="groups" element={<TeacherGroups />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="answers" element={<TeacherAnswers />} />
                  <Route path="tasks" element={<TeacherTasks />} />
                  <Route path="tasks/add" element={<AddTask />} />
                  <Route path="groups/:groupId" element={<GroupDetails />} />
                  {/* Add more teacher routes here */}
                </Route>

                {/* Student Dashboard Routes */}
                <Route
                  path="/student-dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["student"]}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<StudentDashboard />} />
                  <Route path="tasks" element={<StudentTasks />} />
                  <Route path="groups" element={<StudentGroups />} />
                  <Route path="calendar" element={<StudentCalendar />} />
                  <Route path="grades" element={<StudentGrades />} />
                  <Route
                    path="groups/:groupId"
                    element={<StudentGroupTasks />}
                  />
                  {/* Add more student routes here */}
                </Route>

                {/* Shared Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Profile />} />
                </Route>

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </GroupModalProvider>
  </ThemeProvider>
);

export default App;
