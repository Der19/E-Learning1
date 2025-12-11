import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Bell, User, Menu, Video, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "@/lib/auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Données simulées des prochains cours en live
const upcomingLiveCourses = [
  {
    id: "LIVE-001",
    titre: "JavaScript Fondamentaux - Session Live",
    formateur: "Martin Dubois",
    date: "2024-12-15",
    heure: "14:00",
    duree: "2h",
  },
  {
    id: "LIVE-004",
    titre: "SQL Avancé - Session Live",
    formateur: "Sarah Johnson",
    date: "2024-12-18",
    heure: "09:00",
    duree: "2h",
  },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { 
      day: "numeric", 
      month: "short"
    });
  };

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
            {user?.role === "admin" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>Tableau de bord</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/users")}>Utilisateurs</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin/parametrage")}>Paramétrage</Button>
              </>
            )}
            {user?.role === "formateur" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/teacher")}>Tableau de bord</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/courses")}>Cours</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/quizzes")}>Gestion des quiz</Button>
              </>
            )}
            {user?.role === "student" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/student")}>Tableau de bord</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/student/courses")}>Mes Cours</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/student/quizzes")}>Quiz</Button>
              </>
            )}
            {user?.role === "client" && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/client")}>Tableau de bord</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/client/credits")}>Gestion des crédits</Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/client/learners")}>Gestion des apprenants</Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => navigate("/live-courses")}>Cours en Live</Button>
            {!user || (user.role !== "formateur" && user.role !== "student" && user.role !== "client") ? (
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
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full text-white bg-gradient-to-r from-sky-600 to-emerald-600">
                {user.role === 'student' ? 'Apprenant' : user.role === 'formateur' ? 'Formateur' : user.role === 'client' ? 'Collectivité locale' : 'Admin'}
              </span>
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
              {user?.role === "admin" && (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/admin")}>Tableau de bord</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/admin/users")}>Utilisateurs</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/admin/parametrage")}>Paramétrage</Button>
                </>
              )}
              {user?.role === "formateur" && (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/teacher")}>Tableau de bord</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/teacher/courses")}>Cours</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/teacher/quizzes")}>Gestion des quiz</Button>
                </>
              )}
              {user?.role === "student" && (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/student")}>Tableau de bord</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/student/courses")}>Mes Cours</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/student/quizzes")}>Quiz</Button>
                </>
              )}
              {user?.role === "client" && (
                <>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/client")}>Tableau de bord</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/client/credits")}>Gestion des crédits</Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/client/learners")}>Gestion des apprenants</Button>
                </>
              )}
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => navigate("/live-courses")}>Cours en Live</Button>
              {!user || (user.role !== "formateur" && user.role !== "student" && user.role !== "client") ? (
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