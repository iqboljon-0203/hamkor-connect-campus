
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuthStore } from "./store/authStore";

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
import Calendar from "./pages/Calendar";
import TeacherGroups from "./pages/teacher/TeacherGroups";
import StudentTasks from "./pages/student/StudentTasks";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { isAuthenticated, role, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} />;
  }
  
  return <>{children}</>;
};

// Auth layout wrapper
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role } = useAuthStore();
  
  if (isAuthenticated && role) {
    return <Navigate to={role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<AuthLayout><Login /></AuthLayout>} />
            <Route path="/auth/register" element={<AuthLayout><Register /></AuthLayout>} />
            
            {/* Redirect from root to appropriate dashboard or login */}
            <Route path="/" element={<Navigate to="/auth/login" />} />
            
            {/* Teacher Dashboard Routes */}
            <Route path="/teacher-dashboard" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<TeacherDashboard />} />
              <Route path="groups" element={<TeacherGroups />} />
              <Route path="calendar" element={<Calendar />} />
              {/* Add more teacher routes here */}
            </Route>
            
            {/* Student Dashboard Routes */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="tasks" element={<StudentTasks />} />
              <Route path="calendar" element={<Calendar />} />
              {/* Add more student routes here */}
            </Route>
            
            {/* Shared Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Profile />} />
            </Route>
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
