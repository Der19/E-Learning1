// Service de notifications par email
// Utilise EmailJS pour envoyer des emails depuis le frontend

interface StudentEmail {
  email: string;
  name?: string;
}

interface CourseDeadline {
  courseId: string;
  courseTitle: string;
  studentEmail: string;
  deadline: string; // Date limite
  daysRemaining: number;
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
 * Envoie une notification pour un cours avec délai approchant
 */
export async function sendCourseDeadlineNotification(
  course: CourseDeadline
): Promise<boolean> {
  const subject = `⏰ Rappel : Délai du cours "${course.courseTitle}" approchant`;
  const message = `
Bonjour,

Ceci est un rappel automatique concernant le cours "${course.courseTitle}".

⚠️ Attention : Le délai pour terminer ce cours approche !
- Il vous reste ${course.daysRemaining} jour${course.daysRemaining > 1 ? "s" : ""} avant la date limite
- Date limite : ${new Date(course.deadline).toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

Nous vous encourageons à terminer ce cours dans les meilleurs délais.

Cordialement,
L'équipe Kaay Diangu
  `.trim();

  return await sendEmail(course.studentEmail, subject, message);
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
 * Vérifie les cours avec délai approchant et envoie des notifications
 */
export async function checkCourseDeadlines(
  courses: Array<{
    id: string;
    titre: string;
    dateFin?: string;
    disponibilite: string;
  }>
): Promise<number> {
  const now = new Date();
  const sentNotifications: Set<string> = new Set();
  let count = 0;

  for (const course of courses) {
    // Vérifier seulement les cours en cours
    if (course.disponibilite !== "en_cours" || !course.dateFin) {
      continue;
    }

    const deadline = new Date(course.dateFin);
    const daysRemaining = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Envoyer une notification si le délai approche (7 jours ou moins)
    if (daysRemaining <= 7 && daysRemaining > 0) {
      const notificationKey = `deadline-${course.id}`;
      
      // Vérifier si on a déjà envoyé une notification aujourd'hui
      const lastNotification = localStorage.getItem(notificationKey);
      const today = now.toISOString().split("T")[0];
      
      if (lastNotification !== today) {
        for (const student of STUDENT_EMAILS) {
          const sent = await sendCourseDeadlineNotification({
            courseId: course.id,
            courseTitle: course.titre,
            studentEmail: student.email,
            deadline: course.dateFin,
            daysRemaining,
          });

          if (sent) {
            localStorage.setItem(notificationKey, today);
            sentNotifications.add(notificationKey);
            count++;
          }
        }
      }
    }
  }

  return count;
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
    if (diffMinutes >= 9 && diffMinutes <= 11) {
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
 * Vérifie périodiquement les cours et envoie des notifications
 */
export function initializeEmailNotifications(
  getCourses: () => Array<{
    id: string;
    titre: string;
    dateFin?: string;
    disponibilite: string;
  }>,
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
  checkCourseDeadlines(getCourses());
  checkLiveCourseReminders(getLiveCourses());

  // Vérifier toutes les minutes
  const interval = setInterval(() => {
    checkCourseDeadlines(getCourses());
    checkLiveCourseReminders(getLiveCourses());
  }, 60 * 1000); // 1 minute

  return () => clearInterval(interval);
}

