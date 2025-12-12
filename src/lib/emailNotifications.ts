
// Service de notifications par email
// Utilise EmailJS pour envoyer des emails depuis le frontend

import emailjs from '@emailjs/browser';

interface StudentEmail {
  email: string;
  name?: string;
}

interface LiveCourseReminder {
  courseId: string;
  courseTitle: string;
  formateur: string;
  date: string;
  heure: string;
  studentEmail: string;
  minutesUntilStart: number;
}

// Configuration EmailJS
// Pour utiliser ce service, vous devez :
// 1. Créer un compte sur https://www.emailjs.com/
// 2. Créer un service email (Gmail, Outlook, etc.)
// 3. Créer un template d'email
// 4. Remplacer les valeurs ci-dessous par vos clés EmailJS

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // À remplacer
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // À remplacer
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // À remplacer

// Liste des emails des étudiants pour les notifications
// En production, cela devrait venir d'une base de données
const STUDENT_EMAILS: StudentEmail[] = [
  { email: "idoucour9@gmail.com", name: "Étudiant Test" },
  { email: "student@edu.local", name: "Apprenant" },
];

/**
 * Envoie un email via EmailJS
 */
async function sendEmail(
  toEmail: string,
  subject: string,
  message: string
): Promise<boolean> {
  try {
    // Si EmailJS n'est pas configuré, on simule l'envoi pour le développement
    if (
      EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
      EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID"
    ) {
      console.log("📧 [SIMULATION] Email envoyé:", {
        to: toEmail,
        subject,
        message,
      });
      // En production, décommentez le code ci-dessous pour utiliser EmailJS
      return true;
    }

    // Code pour utiliser EmailJS (nécessite l'installation de @emailjs/browser)
    // import emailjs from '@emailjs/browser';
    //
    // const templateParams = {
    //   to_email: toEmail,
    //   subject: subject,
    //   message: message,
    // };
    //
    // await emailjs.send(
    //   EMAILJS_SERVICE_ID,
    //   EMAILJS_TEMPLATE_ID,
    //   templateParams,
    //   EMAILJS_PUBLIC_KEY
    // );

    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}

/**
 * Envoie une notification pour un cours en live qui commence bientôt
 */
export async function sendLiveCourseReminder(
  reminder: LiveCourseReminder
): Promise<boolean> {
  const subject = `🔴 Rappel : Cours en live "${reminder.courseTitle}" dans ${reminder.minutesUntilStart} minutes`;
  const message = `
Bonjour,

Rappel important : Un cours en live va bientôt commencer !

📚 Cours : ${reminder.courseTitle}
👨‍🏫 Formateur : ${reminder.formateur}
📅 Date : ${new Date(reminder.date).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}
⏰ Heure de début : ${reminder.heure}
⏱️ Dans : ${reminder.minutesUntilStart} minute${reminder.minutesUntilStart > 1 ? "s" : ""}

Assurez-vous d'être prêt à rejoindre le cours en live !

Cordialement,
L'équipe Kaay Diangu
  `.trim();

  return await sendEmail(reminder.studentEmail, subject, message);
}

/**
 * Récupère la liste des emails des étudiants
 */
export function getStudentEmails(): StudentEmail[] {
  return STUDENT_EMAILS;
}

/**
 * Vérifie les cours en live qui commencent bientôt et envoie des notifications
 */
export async function checkLiveCourseReminders(
  liveCourses: Array<{
    id: string;
    titre: string;
    formateur: string;
    date: string;
    heure: string;
    statut: string;
  }>
): Promise<number> {
  const now = new Date();
  let count = 0;

  for (const course of liveCourses) {
    // Vérifier seulement les cours à venir
    if (course.statut !== "a_venir") {
      continue;
    }

    // Calculer la date/heure de début du cours
    const [hours, minutes] = course.heure.split(":").map(Number);
    const courseDateTime = new Date(course.date);
    courseDateTime.setHours(hours, minutes, 0, 0);

    const diffMs = courseDateTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    // Envoyer une notification si le cours commence dans 10 minutes (± 1 minute de tolérance)
    // Pour le test : détecte aussi les cours qui commencent dans 1-3 minutes
    if ((diffMinutes >= 9 && diffMinutes <= 11) || (diffMinutes >= 1 && diffMinutes <= 3)) {
      const notificationKey = `live-${course.id}`;
      
      // Vérifier si on a déjà envoyé une notification pour ce cours
      const lastNotification = localStorage.getItem(notificationKey);
      const nowMinutes = Math.floor(now.getTime() / (1000 * 60));
      
      if (lastNotification !== String(nowMinutes)) {
        for (const student of STUDENT_EMAILS) {
          const sent = await sendLiveCourseReminder({
            courseId: course.id,
            courseTitle: course.titre,
            formateur: course.formateur,
            date: course.date,
            heure: course.heure,
            studentEmail: student.email,
            minutesUntilStart: diffMinutes,
          });

          if (sent) {
            localStorage.setItem(notificationKey, String(nowMinutes));
            count++;
          }
        }
      }
    }
  }

  return count;
}

/**
 * Initialise le système de notifications
 * Vérifie périodiquement les cours en live et envoie des notifications
 */
export function initializeEmailNotifications(
  getLiveCourses: () => Array<{
    id: string;
    titre: string;
    formateur: string;
    date: string;
    heure: string;
    statut: string;
  }>
) {
  // Vérifier immédiatement
  checkLiveCourseReminders(getLiveCourses());

  // Vérifier toutes les minutes
  const interval = setInterval(() => {
    checkLiveCourseReminders(getLiveCourses());
  }, 60 * 1000); // 1 minute

  return () => clearInterval(interval);
}

