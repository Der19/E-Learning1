import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, CreditCard, ShoppingCart, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord Client</h1>
          <p className="text-muted-foreground">Vue d'ensemble de votre compte, crédits et apprenants</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Crédits restants" value="1,250" change="+150 ajoutés" icon={CreditCard} variant="primary" />
          <StatsCard title="Apprenants" value="12" change="+2 nouveaux" icon={Users} variant="success" />
          <StatsCard title="Formations achetées" value="34" change="+5 ce mois" icon={ShoppingCart} variant="info" />
          <StatsCard title="Crédits offerts" value="50" change="-" icon={Gift} variant="warning" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button className="bg-gradient-primary" onClick={()=>navigate("/client/credits")}>Acheter des crédits</Button>
              <Button variant="outline" onClick={()=>navigate("/client/learners")}>Créer un apprenant</Button>
              <Button variant="outline">Voir l'historique</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>Dernier achat: 200 crédits via CB</div>
              <div>Apprenant actif: K. Diallo (120 crédits)</div>
              <div>Contact support: support@edu.local</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


