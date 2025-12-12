import { useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import {
  initializeEmailNotifications,
  getStudentEmails,
} from "@/lib/emailNotifications";

/**
 * Composant qui initialise le système de notifications par email
 * Vérifie périodiquement les cours et envoie des notifications aux étudiants
 */
export function EmailNotificationsProvider() {
  useEffect(() => {
    // Ne vérifier que si un utilisateur est connecté
    const user = getCurrentUser();
    if (!user || user.role !== "student") {
      return;
    }

    // Fonction pour récupérer les cours de l'étudiant depuis localStorage
    const getStudentCourses = () => {
      try {
        const stored = localStorage.getItem("student:courses");
        if (stored) {
          const courses = JSON.parse(stored);
          return courses.map((c: any) => ({
            id: c.id,
            titre: c.titre,
            dateFin: c.dateFin,
            disponibilite: c.disponibilite,
          }));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des cours:", error);
      }
      return [];
    };

    // Fonction pour récupérer les cours en live depuis localStorage
    const getLiveCourses = () => {
      try {
        const stored = localStorage.getItem("live:courses");
        if (stored) {
          const courses = JSON.parse(stored);
          return courses.map((c: any) => ({
            id: c.id,
            titre: c.titre,
            formateur: c.formateur,
            date: c.date,
            heure: c.heure,
            statut: c.statut,
          }));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des cours en live:", error);
      }
      // Données par défaut si rien n'est stocké
      return [
        {
          id: "LIVE-001",
          titre: "JavaScript Fondamentaux - Session Live",
          formateur: "Martin Dubois",
          date: "2024-12-15",
          heure: "14:00",
          statut: "a_venir",
        },
        {
          id: "LIVE-004",
          titre: "SQL Avancé - Session Live",
          formateur: "Sarah Johnson",
          date: "2024-12-18",
          heure: "09:00",
          statut: "a_venir",
        },
      ];
    };

    // Initialiser le système de notifications
    const cleanup = initializeEmailNotifications(
      getStudentCourses,
      getLiveCourses
    );

    return cleanup;
  }, []);

  return null;
}

