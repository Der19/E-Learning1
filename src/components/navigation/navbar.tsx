import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "@/lib/auth";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kaay Diangu</h1>
              <p className="text-xs text-muted-foreground">Plateforme E-Learning</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Accueil</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/formations")}>Formations</Button>
            {user?.role === "teacher" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/courses")}>Cours</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/quizzes")}>Gestion des quiz</Button>
              </>
            )}
            {user?.role === "student" && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/quizzes")}>Quiz</Button>
            )}
            {user?.role === "client" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/client/credits")}>Gestion des crédits</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/client/learners")}>Gestion des apprenants</Button>
              </>
            )}
            {!user || (user.role !== "teacher" && user.role !== "student" && user.role !== "client") ? (
              <Button variant="ghost" size="sm" onClick={() => navigate("/support")}>Support</Button>
            ) : null}
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 bg-warning">
                3
              </Badge>
            </Button>
            
            {user ? (
            <div className="hidden md:flex items-center space-x-2 bg-white/50 rounded-full px-3 py-1">
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
                <span className="text-sm font-medium capitalize">{user.role}</span>
                <Button size="sm" variant="ghost" onClick={() => { logout(); navigate("/login"); }}>Déconnexion</Button>
            </div>
            ) : (
              <Button size="sm" className="bg-gradient-primary" onClick={() => navigate("/login")}>Se connecter</Button>
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/")}>Accueil</Button>
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/formations")}>Formations</Button>
              {user?.role === "teacher" && (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/teacher/courses")}>Cours</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/teacher/quizzes")}>Gestion des quiz</Button>
                </>
              )}
              {user?.role === "student" && (
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/student/quizzes")}>Quiz</Button>
              )}
              {user?.role === "client" && (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/client/credits")}>Gestion des crédits</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/client/learners")}>Gestion des apprenants</Button>
                </>
              )}
              {!user || (user.role !== "teacher" && user.role !== "student" && user.role !== "client") ? (
                <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/support")}>Support</Button>
              ) : null}
              {user ? (
                <Button variant="outline" size="sm" className="justify-start" onClick={() => { logout(); navigate("/login"); }}>Déconnexion</Button>
              ) : (
                <Button className="justify-start bg-gradient-primary" size="sm" onClick={() => navigate("/login")}>Se connecter</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}