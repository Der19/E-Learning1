import { Navbar } from "@/components/navigation/navbar";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, BookOpen, CreditCard, School, Users } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Module Paramétrage
          </h1>
          <p className="text-muted-foreground">
            Tableau de bord administrateur - Gestion globale de la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Clients Actifs"
            value="1,248"
            change="+12% ce mois"
            icon={Users}
            variant="success"
          />
          <StatsCard
            title="Apprenants Actifs"
            value="87"
            change="+3 nouvelles"
            icon={School}
            variant="info"
          />
          <StatsCard
            title="Formations Actives"
            value="342"
            change="+18 publiées"
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="CA ce mois"
            value="145k€"
            change="+25% vs dernier mois"
            icon={CreditCard}
            variant="success"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-warning" />
              Alertes Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-warning rounded-full mr-2" />
                  <span className="font-medium text-sm">Maintenance</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mise à jour prévue ce soir à 22h
                </p>
              </div>
              
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-success rounded-full mr-2" />
                  <span className="font-medium text-sm">Sauvegarde</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Backup automatique réussi
                </p>
              </div>
              
              <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-2 h-2 bg-info rounded-full mr-2" />
                  <span className="font-medium text-sm">Nouveau client</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  École Supérieure inscrite
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}