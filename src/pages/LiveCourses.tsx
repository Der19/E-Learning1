import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useEffect } from "react";
import { Calendar, Clock, User, Video, Play, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LiveCourse = {
  id: string;
  titre: string;
  formateur: string;
  date: string; // Format: YYYY-MM-DD
  heure: string; // Format: HH:MM
  duree: string; // Format: "2h" ou "1h30"
  lienLive?: string;
  statut: "a_venir" | "en_cours" | "termine";
  description?: string;
};

export default function LiveCourses() {
  const [filter, setFilter] = useState<"all" | "a_venir" | "en_cours" | "termine">("all");

  // Fonction pour créer un cours de test qui commence dans 2 minutes
  const createTestLiveCourse = (): LiveCourse => {
    const now = new Date();
    const testDate = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes pour test
    const dateStr = testDate.toISOString().split('T')[0];
    const heureStr = `${String(testDate.getHours()).padStart(2, '0')}:${String(testDate.getMinutes()).padStart(2, '0')}`;
    
    return {
      id: "LIVE-TEST-10MIN",
      titre: "Cours de Test - Notification Email",
      formateur: "Martin Dubois",
      date: dateStr,
      heure: heureStr,
      duree: "2h",
      lienLive: "https://meet.example.com/test-notification",
      statut: "a_venir",
      description: "Ce cours est un test pour vérifier les notifications par email. Il commence dans 2 minutes.",
    };
  };

  // Charger les cours depuis localStorage ou utiliser les données par défaut
  const loadLiveCourses = (): LiveCourse[] => {
    try {
      const stored = localStorage.getItem("live:courses");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cours en live:", error);
    }
    // Données par défaut avec un cours de test
    return [
      createTestLiveCourse(),
      {
      id: "LIVE-001",
      titre: "JavaScript Fondamentaux - Session Live",
      formateur: "Martin Dubois",
      date: "2024-12-15",
      heure: "14:00",
      duree: "2h",
      lienLive: "https://meet.example.com/js-basics",
      statut: "a_venir",
      description: "Introduction complète au JavaScript avec exemples pratiques en direct",
    },
    {
      id: "LIVE-002",
      titre: "React Avancé - Workshop Live",
      formateur: "Martin Dubois",
      date: "2024-12-12",
      heure: "10:00",
      duree: "3h",
      lienLive: "https://meet.example.com/react-adv",
      statut: "en_cours",
      description: "Maîtrisez les hooks avancés et les optimisations React",
    },
    {
      id: "LIVE-003",
      titre: "API REST avec Node.js",
      formateur: "Martin Dubois",
      date: "2024-12-10",
      heure: "15:30",
      duree: "2h30",
      statut: "termine",
      description: "Création d'APIs RESTful avec Express",
    },
    {
      id: "LIVE-004",
      titre: "SQL Avancé - Session Live",
      formateur: "Sarah Johnson",
      date: "2024-12-18",
      heure: "09:00",
      duree: "2h",
      lienLive: "https://meet.example.com/sql-adv",
      statut: "a_venir",
      description: "Requêtes complexes et optimisations SQL",
    },
    {
      id: "LIVE-005",
      titre: "Algorithmique - Workshop",
      formateur: "Sarah Johnson",
      date: "2024-12-20",
      heure: "13:00",
      duree: "2h30",
      lienLive: "https://meet.example.com/algo",
      statut: "a_venir",
      description: "Structures de données et algorithmes fondamentaux",
    },
  ];
  };

  const [liveCourses, setLiveCourses] = useState<LiveCourse[]>(loadLiveCourses);

  // Sauvegarder les cours dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("live:courses", JSON.stringify(liveCourses));
  }, [liveCourses]);

  const filtered = useMemo(() => {
    if (filter === "all") return liveCourses;
    return liveCourses.filter(c => c.statut === filter);
  }, [liveCourses, filter]);

  const getStatutBadge = (statut: LiveCourse["statut"]) => {
    switch (statut) {
      case "a_venir":
        return <Badge className="bg-info">À venir</Badge>;
      case "en_cours":
        return <Badge className="bg-success animate-pulse">En cours</Badge>;
      case "termine":
        return <Badge variant="secondary">Terminé</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isUpcoming = (dateStr: string, heure: string) => {
    const now = new Date();
    const courseDate = new Date(`${dateStr}T${heure}`);
    return courseDate > now && courseDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000); // Dans les 24h
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cours en Live</h1>
          <p className="text-muted-foreground">Consultez les prochains cours en direct avec vos formateurs</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-primary" />
                Programme des cours en live
              </CardTitle>
              <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les cours</SelectItem>
                  <SelectItem value="a_venir">À venir</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="termine">Terminés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Aucun cours en live trouvé
                </div>
              ) : (
                filtered.map(course => {
                  const isTodayCourse = isToday(course.date);
                  const isUpcomingCourse = isUpcoming(course.date, course.heure);
                  
                  return (
                    <Card 
                      key={course.id} 
                      className={`transition-all hover:shadow-lg ${
                        course.statut === "en_cours" ? "border-success border-2" : 
                        isUpcomingCourse ? "border-primary border-2" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{course.titre}</h3>
                              {getStatutBadge(course.statut)}
                              {isTodayCourse && (
                                <Badge variant="outline" className="bg-primary/10">
                                  Aujourd'hui
                                </Badge>
                              )}
                            </div>
                            {course.description && (
                              <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{formatDate(course.date)}</div>
                              {isTodayCourse && (
                                <div className="text-xs text-primary font-medium">Aujourd'hui</div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{course.heure}</div>
                              <div className="text-xs text-muted-foreground">Heure de début</div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{course.formateur}</div>
                              <div className="text-xs text-muted-foreground">Formateur</div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{course.duree}</div>
                              <div className="text-xs text-muted-foreground">Durée</div>
                            </div>
                          </div>
                        </div>

                        {course.statut === "en_cours" && course.lienLive && (
                          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Cours en cours</span>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-success"
                                onClick={() => window.open(course.lienLive, '_blank')}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Rejoindre le live
                              </Button>
                            </div>
                          </div>
                        )}

                        {course.statut === "a_venir" && course.lienLive && (
                          <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {isUpcomingCourse ? (
                                <span className="text-primary font-medium">Cours dans moins de 24h</span>
                              ) : (
                                <span>Lien de connexion disponible le jour du cours</span>
                              )}
                            </div>
                            {isUpcomingCourse && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Ajouter au calendrier ou notifier
                                  navigator.clipboard.writeText(course.lienLive || '');
                                  alert("Lien copié dans le presse-papier");
                                }}
                              >
                                Copier le lien
                              </Button>
                            )}
                          </div>
                        )}

                        {course.statut === "termine" && (
                          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4" />
                            <span>Ce cours est terminé. Le replay sera disponible prochainement.</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

