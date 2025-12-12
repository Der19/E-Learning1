import { Navbar } from "@/components/navigation/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState, useEffect } from "react";
import { BookOpen, Clock, User, Play, CheckCircle, XCircle, Search } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cours, uvs } from "@/lib/adminData";

type CourseAvailability = "disponible" | "en_cours" | "termine" | "non_disponible";

type StudentCourse = {
  id: string;
  code: string;
  titre: string;
  description: string;
  uvCode: string;
  formateur: string;
  duree: string;
  disponibilite: CourseAvailability;
  creditsRequires: number;
  progression?: number;
  dateDebut?: string;
  dateFin?: string;
};

export default function StudentCourses() {
  const [search, setSearch] = useState("");
  const [disponibiliteFilter, setDisponibiliteFilter] = useState<CourseAvailability | "all">("all");
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [creditsDisponibles] = useState(127); // Simulé - devrait venir du contexte utilisateur

  // Charger les cours depuis localStorage ou utiliser les données par défaut
  const loadStudentCourses = (): StudentCourse[] => {
    try {
      const stored = localStorage.getItem("student:courses");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error);
    }
    // Données par défaut
    return [
    {
      id: "1",
      code: "JS-BASICS",
      titre: "JavaScript Fondamentaux",
      description: "Apprenez les bases du JavaScript : syntaxe, types, fonctions et structures de contrôle",
      uvCode: "WEB-201",
      formateur: "Martin Dubois",
      duree: "12h",
      disponibilite: "disponible",
      creditsRequires: 50,
      progression: 0,
    },
    {
      id: "2",
      code: "ALGO-INTRO",
      titre: "Algorithmique",
      description: "Découvrez les structures de données et algorithmes fondamentaux",
      uvCode: "PROG-101",
      formateur: "Sarah Johnson",
      duree: "15h",
      disponibilite: "en_cours",
      creditsRequires: 60,
      progression: 45,
      dateDebut: "2024-01-15",
    },
    {
      id: "3",
      code: "REACT-ADV",
      titre: "React Avancé",
      description: "Maîtrisez les hooks avancés, le contexte et les performances React",
      uvCode: "WEB-201",
      formateur: "Martin Dubois",
      duree: "18h",
      disponibilite: "disponible",
      creditsRequires: 80,
      progression: 0,
    },
    {
      id: "4",
      code: "NODE-API",
      titre: "API REST avec Node.js",
      description: "Créez des APIs RESTful avec Express et MongoDB",
      uvCode: "WEB-201",
      formateur: "Martin Dubois",
      duree: "20h",
      disponibilite: "non_disponible",
      creditsRequires: 100,
      progression: 0,
    },
    {
      id: "5",
      code: "SQL-BASE",
      titre: "SQL pour débutants",
      description: "Apprenez les requêtes SQL de base et la gestion de bases de données",
      uvCode: "DATA-101",
      formateur: "Sarah Johnson",
      duree: "10h",
      disponibilite: "termine",
      creditsRequires: 40,
      progression: 100,
      dateDebut: "2023-12-01",
      dateFin: "2024-01-10",
    },
  ];
  };

  const [studentCourses, setStudentCourses] = useState<StudentCourse[]>(loadStudentCourses);

  // Sauvegarder les cours dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("student:courses", JSON.stringify(studentCourses));
  }, [studentCourses]);

  const filtered = useMemo(() => {
    return studentCourses.filter(c => {
      const matchesSearch = !search || 
        c.titre.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesDisponibilite = disponibiliteFilter === "all" || c.disponibilite === disponibiliteFilter;
      
      return matchesSearch && matchesDisponibilite;
    });
  }, [studentCourses, search, disponibiliteFilter]);

  const getDisponibiliteBadge = (disponibilite: CourseAvailability) => {
    switch (disponibilite) {
      case "disponible":
        return <Badge className="bg-success">Disponible</Badge>;
      case "en_cours":
        return <Badge className="bg-primary">En cours</Badge>;
      case "termine":
        return <Badge variant="secondary">Terminé</Badge>;
      case "non_disponible":
        return <Badge variant="destructive">Non disponible</Badge>;
    }
  };

  const canLaunchCourse = (course: StudentCourse): { can: boolean; reason?: string } => {
    if (course.disponibilite === "non_disponible") {
      return { can: false, reason: "Ce cours n'est pas disponible pour le moment" };
    }
    if (course.disponibilite === "termine") {
      return { can: false, reason: "Ce cours est déjà terminé" };
    }
    if (creditsDisponibles < course.creditsRequires) {
      return { can: false, reason: `Crédits insuffisants (${course.creditsRequires} requis, ${creditsDisponibles} disponibles)` };
    }
    return { can: true };
  };

  const handleLaunchCourse = (course: StudentCourse) => {
    const check = canLaunchCourse(course);
    if (!check.can) {
      toast({ 
        title: "Impossible de lancer le cours", 
        description: check.reason,
        variant: "destructive"
      });
      return;
    }

    setSelectedCourse(course);
    setLaunchDialogOpen(true);
  };

  const confirmLaunch = () => {
    if (!selectedCourse) return;

    // Mettre à jour le statut du cours
    setStudentCourses(prev => prev.map(c => 
      c.id === selectedCourse.id 
        ? { ...c, disponibilite: "en_cours" as CourseAvailability, progression: 0, dateDebut: new Date().toISOString().split('T')[0] }
        : c
    ));

    toast({ 
      title: "Cours lancé avec succès", 
      description: `Vous pouvez maintenant commencer "${selectedCourse.titre}"`
    });

    setLaunchDialogOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mes Cours</h1>
          <p className="text-muted-foreground">Consultez et lancez les cours selon votre disponibilité</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Catalogue de cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="relative flex-1 min-w-[250px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Rechercher un cours..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  className="pl-10"
                />
              </div>
              <Select value={disponibiliteFilter} onValueChange={(v) => setDisponibiliteFilter(v as CourseAvailability | "all")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrer par disponibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les cours</SelectItem>
                  <SelectItem value="disponible">Disponibles</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="termine">Terminés</SelectItem>
                  <SelectItem value="non_disponible">Non disponibles</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">{creditsDisponibles}</strong> crédits disponibles
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Aucun cours trouvé
                </div>
              ) : (
                filtered.map(course => {
                  const check = canLaunchCourse(course);
                  const uv = uvs.find(u => u.code === course.uvCode);
                  
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{course.titre}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{course.code}</p>
                          </div>
                          {getDisponibiliteBadge(course.disponibilite)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <User className="h-4 w-4 mr-2" />
                            {course.formateur}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <BookOpen className="h-4 w-4 mr-2" />
                            {uv?.libelle || course.uvCode}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            {course.duree}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Crédits requis:</span>
                            <span className={`font-medium ${creditsDisponibles >= course.creditsRequires ? 'text-success' : 'text-destructive'}`}>
                              {course.creditsRequires}
                            </span>
                          </div>
                        </div>

                        {course.progression !== undefined && course.progression > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progression</span>
                              <span>{course.progression}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ width: `${course.progression}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {course.disponibilite === "en_cours" ? (
                            <Button 
                              className="flex-1 bg-gradient-primary"
                              onClick={() => handleLaunchCourse(course)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Continuer
                            </Button>
                          ) : course.disponibilite === "disponible" ? (
                            <Button 
                              className="flex-1 bg-gradient-primary"
                              onClick={() => handleLaunchCourse(course)}
                              disabled={!check.can}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Lancer le cours
                            </Button>
                          ) : course.disponibilite === "termine" ? (
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              disabled
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Terminé
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              disabled
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Indisponible
                            </Button>
                          )}
                        </div>

                        {!check.can && check.reason && course.disponibilite === "disponible" && (
                          <p className="text-xs text-destructive mt-1">{check.reason}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de confirmation de lancement */}
        <Dialog open={launchDialogOpen} onOpenChange={setLaunchDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lancer le cours</DialogTitle>
            </DialogHeader>
            {selectedCourse && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{selectedCourse.titre}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{selectedCourse.description}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée:</span>
                    <span className="font-medium">{selectedCourse.duree}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crédits requis:</span>
                    <span className="font-medium">{selectedCourse.creditsRequires}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crédits disponibles:</span>
                    <span className={`font-medium ${creditsDisponibles >= selectedCourse.creditsRequires ? 'text-success' : 'text-destructive'}`}>
                      {creditsDisponibles}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    En lançant ce cours, <strong>{selectedCourse.creditsRequires} crédits</strong> seront débités de votre compte.
                    Vous pourrez commencer immédiatement à suivre les modules.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setLaunchDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-gradient-primary" onClick={confirmLaunch}>
                Confirmer et lancer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

