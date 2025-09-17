import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import AdminParametrage from "./pages/AdminParametrage";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import AdminFormations from "./pages/AdminFormations";
import Formations from "./pages/Formations";
import Login from "./pages/Login";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherQuizPreview from "./pages/TeacherQuizPreview";
import TeacherCourses from "./pages/TeacherCourses";
import TeacherCourseModules from "./pages/TeacherCourseModules";
import { RequireRole } from "@/components/auth/RequireRole";
import ClientDashboard from "./pages/ClientDashboard";
import ClientCredits from "./pages/ClientCredits";
import ClientLearners from "./pages/ClientLearners";
import StudentQuizzesList from "./pages/StudentQuizzesList";
import StudentQuizTake from "./pages/StudentQuizTake";
import Support from "./pages/Support";
import StudentQuizResult from "./pages/StudentQuizResult";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="/admin"
            element={
              <RequireRole role="admin">
                <AdminDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/admin/formations"
            element={
              <RequireRole role="admin">
                <AdminFormations />
              </RequireRole>
            }
          />
          <Route
            path="/admin/parametrage"
            element={
              <RequireRole role="admin">
                <AdminParametrage />
              </RequireRole>
            }
          />
          <Route
            path="/teacher"
            element={
              <RequireRole role="teacher">
                <TeacherDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/teacher/quizzes"
            element={
              <RequireRole role="teacher">
                <TeacherQuizzes />
              </RequireRole>
            }
          />
          <Route
            path="/teacher/courses"
            element={
              <RequireRole role="teacher">
                <TeacherCourses />
              </RequireRole>
            }
          />
          <Route
            path="/teacher/courses/:id/modules"
            element={
              <RequireRole role="teacher">
                <TeacherCourseModules />
              </RequireRole>
            }
          />
          <Route
            path="/teacher/quizzes/preview"
            element={
              <RequireRole role="teacher">
                <TeacherQuizPreview />
              </RequireRole>
            }
          />
          <Route
            path="/student"
            element={
              <RequireRole role="student">
                <StudentDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/client"
            element={
              <RequireRole role="client">
                <ClientDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/client/credits"
            element={
              <RequireRole role="client">
                <ClientCredits />
              </RequireRole>
            }
          />
          <Route
            path="/client/learners"
            element={
              <RequireRole role="client">
                <ClientLearners />
              </RequireRole>
            }
          />
          <Route
            path="/student/quizzes"
            element={
              <RequireRole role="student">
                <StudentQuizzesList />
              </RequireRole>
            }
          />
          <Route
            path="/student/quizzes/:id"
            element={
              <RequireRole role="student">
                <StudentQuizTake />
              </RequireRole>
            }
          />
          <Route
            path="/student/quizzes/result"
            element={
              <RequireRole role="student">
                <StudentQuizResult />
              </RequireRole>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
