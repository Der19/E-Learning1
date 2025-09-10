import { Navbar } from "@/components/navigation/navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Support & Aide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq1">
                <AccordionTrigger>Comment acheter des crédits ?</AccordionTrigger>
                <AccordionContent>
                  Allez dans "Gestion des crédits", saisissez le montant et choisissez un moyen de paiement (CB, OM, Wave).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq2">
                <AccordionTrigger>Je n'arrive pas à me connecter</AccordionTrigger>
                <AccordionContent>
                  Vérifiez votre email/mot de passe. Sinon, contactez l'administrateur pour réinitialiser vos accès.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq3">
                <AccordionTrigger>Comment créer un apprenant ?</AccordionTrigger>
                <AccordionContent>
                  Côté client, ouvrez "Gestion des apprenants", renseignez le code, le nom, le mot de passe puis cliquez "Créer".
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Contacter le support</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Votre email" />
                <Input placeholder="Sujet" />
              </div>
              <Textarea placeholder="Décrivez votre problème ou question" />
              <div className="flex justify-end">
                <Button className="bg-gradient-primary">Envoyer</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


