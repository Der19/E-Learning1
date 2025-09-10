import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navigation/navbar";
import { login, getCurrentUser, getDefaultCredentials } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const navigate = useNavigate();
  const existing = getCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (existing) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = login(email.trim(), password);
    if (!res) {
      setError("Identifiants invalides.");
      return;
    }
    navigate(res.redirectPath, { replace: true });
  };

  const examples = getDefaultCredentials();

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-lg">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-2">Connexion</h1>
            <p className="text-muted-foreground mb-6">Accédez à votre espace.</p>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: admin@edu.local"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">Se connecter</Button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Comptes de démonstration:</p>
              <div className="space-y-2">
                {examples.map((u) => (
                  <div key={u.email} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                    <span className="font-medium">{u.role}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{u.email} / {u.password}</span>
                      <Button size="sm" variant="outline" onClick={() => { setEmail(u.email); setPassword(u.password); }}>
                        Remplir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}




