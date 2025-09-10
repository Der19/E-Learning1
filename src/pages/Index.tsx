import { ModuleCard } from "@/components/ui/module-card";
import { Navbar } from "@/components/navigation/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, BookOpen, Users, GraduationCap, Star, Zap, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Module Paramétrage",
      description: "Interface d'administration complète pour la gestion globale de la plateforme, des utilisateurs et des configurations système.",
      icon: Settings,
      userType: "Administrateur",
      gradient: "bg-gradient-primary",
      features: [
        "Gestion des tables de référence",
        "Administration des utilisateurs",
        "Configuration des contenus et licences",
        "Système de reporting avancé"
      ],
      onClick: () => navigate("/admin")
    },
    {
      title: "Module Configuration", 
      description: "Outil de création et gestion de contenus pédagogiques pour les enseignants avec système d'évaluation intégré.",
      icon: BookOpen,
      userType: "Enseignant",
      gradient: "bg-gradient-accent",
      features: [
        "Création de cours structurés (UV/Cours/Modules)",
        "Gestion des quiz et évaluations",
        "Système de scoring et certifications",
        "Forums de discussion intégrés"
      ],
      onClick: () => navigate("/teacher")
    },
    {
      title: "Module Exploitation",
      description: "Interface client et apprenant pour l'achat de formations, la gestion des crédits et le suivi pédagogique.",
      icon: Users,
      userType: "Client/Apprenant",
      gradient: "bg-success",
      features: [
        "Système de paiement sécurisé",
        "Gestion des apprenants et crédits",
        "Suivi de progression personnalisé",
        "Évaluations et certifications"
      ],
      onClick: () => navigate("/student")
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Plateforme sécurisée avec gestion des droits et paiements cryptés"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Interface rapide et responsive, optimisée pour tous les appareils"
    },
    {
      icon: Star,
      title: "Intuitif",
      description: "Design moderne et expérience utilisateur soignée"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Plateforme E-Learning Professionnelle
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Transformez l'apprentissage avec 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Kaay Diangu</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
              Solution complète de e-learning avec gestion avancée des utilisateurs, 
              création de contenus pédagogiques et système de crédits intégré.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button size="lg" className="bg-gradient-primary text-lg px-8">
                <GraduationCap className="mr-2 h-5 w-5" />
                Découvrir la Démo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Voir les Tarifs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Trois Modules, Une Solution Complète
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Architecture modulaire adaptée aux différents profils d'utilisateurs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {modules.map((module, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <ModuleCard {...module} />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pourquoi Choisir Notre Plateforme ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="inline-flex p-4 bg-gradient-primary rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-primary text-white text-center overflow-hidden relative">
          <CardContent className="p-12 relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Révolutionner Votre Formation ?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Rejoignez les établissements qui ont choisi l'excellence avec notre plateforme e-learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Demander une Démo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contacter l'Équipe
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
