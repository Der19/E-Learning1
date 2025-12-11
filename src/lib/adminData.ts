export type ReferenceItem = {
  code: string;
  libelle: string;
  ordre: number;
};

export type Fonction = ReferenceItem;
export type StatutContenu = ReferenceItem;
export type Profil = ReferenceItem;
export type TypeRessourcePedagogique = ReferenceItem;
export type TypeQuiz = ReferenceItem & {
  description?: string;
  coefficientParDefaut?: number;
  dureeMaximaleParDefaut?: number; // minutes
};
export type ModePaiement = ReferenceItem;

export interface Theme extends ReferenceItem {}

export interface SousTheme extends ReferenceItem {
  themeCode: string;
}

export interface Section extends ReferenceItem {
  sousThemeCode: string;
}

export interface Ecole {
  code: string;
  nom: string;
  contacts: string;
  password: string;
  etat: "actif" | "sommeil" | "inactif";
  ordre: number;
}

export const fonctions: Fonction[] = [
  { code: "ADM", libelle: "Administrateur", ordre: 1 },
  { code: "ENS", libelle: "Formateur", ordre: 2 },
  { code: "APP", libelle: "Apprenant", ordre: 3 },
  { code: "CLI", libelle: "Collectivité locale", ordre: 4 },
];

export const statutsContenu: StatutContenu[] = [
  { code: "PUB", libelle: "Publié", ordre: 1 },
  { code: "DISP", libelle: "Disponible", ordre: 2 },
  { code: "GRP", libelle: "Gratuit_Payant", ordre: 3 },
  { code: "SLP", libelle: "En sommeil", ordre: 4 },
  { code: "DEL", libelle: "Supprimé", ordre: 5 },
];

export const profils: Profil[] = [
  { code: "ADMIN", libelle: "Administrateur", ordre: 1 },
  { code: "ENSEIGN", libelle: "Formateur", ordre: 2 },
  { code: "CLIENT", libelle: "Collectivité locale", ordre: 3 },
  { code: "APPREN", libelle: "Apprenant", ordre: 4 },
];

export const themes: Theme[] = [
  { code: "DEV", libelle: "Développement", ordre: 1 },
  { code: "DATA", libelle: "Données", ordre: 2 },
  { code: "DESIGN", libelle: "Design", ordre: 3 },
];

export const sousThemes: SousTheme[] = [
  { code: "REACT", libelle: "React", themeCode: "DEV", ordre: 1 },
  { code: "NODE", libelle: "Node.js", themeCode: "DEV", ordre: 2 },
  { code: "SQL", libelle: "SQL", themeCode: "DATA", ordre: 1 },
  { code: "UX", libelle: "UX", themeCode: "DESIGN", ordre: 1 },
];

export const sections: Section[] = [
  { code: "HOOKS", libelle: "Hooks avancés", sousThemeCode: "REACT", ordre: 1 },
  { code: "STATE", libelle: "Gestion d'état", sousThemeCode: "REACT", ordre: 2 },
  { code: "EXPRESS", libelle: "Express", sousThemeCode: "NODE", ordre: 1 },
  { code: "PG", libelle: "PostgreSQL", sousThemeCode: "SQL", ordre: 1 },
  { code: "RECHERCHE", libelle: "Recherche utilisateur", sousThemeCode: "UX", ordre: 1 },
];

export const ecoles: Ecole[] = [
  {
    code: "ESI",
    nom: "École Supérieure d'Informatique",
    contacts: "+33 1 23 45 67 89",
    password: "esi2025",
    etat: "actif",
    ordre: 1,
  },
  {
    code: "BUS",
    nom: "Business Academy",
    contacts: "+33 9 87 65 43 21",
    password: "bus@123",
    etat: "sommeil",
    ordre: 2,
  },
];

export const typesRessourcePedagogique: TypeRessourcePedagogique[] = [
  { code: "PDF", libelle: "PDF", ordre: 1 },
  { code: "DOC", libelle: "Word", ordre: 2 },
  { code: "XLS", libelle: "Excel", ordre: 3 },
  { code: "URL", libelle: "Lien_URL", ordre: 4 },
  { code: "WEB", libelle: "Site_web", ordre: 5 },
];

export const typesQuiz: TypeQuiz[] = [
  { code: "DEV", libelle: "Devoir", ordre: 1, description: "Évaluation notée à corriger", coefficientParDefaut: 1, dureeMaximaleParDefaut: 60 },
  { code: "EXO", libelle: "Exercice", ordre: 2, description: "Exercice d'entraînement", coefficientParDefaut: 1, dureeMaximaleParDefaut: 30 },
];

export const modesPaiement: ModePaiement[] = [
  { code: "CB", libelle: "Carte bancaire", ordre: 1 },
  { code: "EME", libelle: "EME", ordre: 2 },
  { code: "AUT", libelle: "Autres", ordre: 3 },
];

// -------------------------
// Contenus pédagogiques
// -------------------------

export interface UV {
  code: string;
  libelle: string;
  description: string;
  presentationEcrite: string;
  lienTeaserUV: string;
  coefficient: number;
  eliminatoire: "O" | "N";
  noteValidation: number;
  ordre: number;
}

export interface Cours {
  code: string;
  libelle: string;
  description: string;
  presentationEcrite: string;
  lienTeaserCours: string;
  lienPlaylistCours: string;
  uvCode: string;
  enseignant: string;
  coefficient: number;
  ordre: number;
}

export interface ModuleCours {
  code: string;
  libelle: string;
  description: string;
  presentationEcrite: string;
  lienTeaserModule: string;
  lienPlaylistModule: string;
  coursCode: string;
  ordre: number;
}

export interface Lecon {
  code: string;
  libelle: string;
  description: string;
  presentationEcrite: string;
  lienTeaserLecon: string;
  lienPlaylistLecon: string;
  moduleCode: string;
  ordre: number;
}

export interface Bibliotheque {
  code: string;
  libelle: string;
  description: string;
  presentationEcrite: string;
  ordre: number;
}

export interface Ressource {
  code: string;
  libelle: string;
  description: string;
  presentationEcrite: string;
  typeRessource: string; // se réfère à typesRessourcePedagogique.code
  cheminRessource: string;
  bibliothequeCode: string;
  ordre: number;
}

export type ContenuType = "UV" | "Cours" | "Module" | "Lecon";

export interface LienContenuBibliotheque {
  contenuType: ContenuType;
  contenuCode: string;
  bibliothequeCode: string;
}

export interface LienContenuSection {
  contenuType: ContenuType;
  contenuCode: string;
  sectionCode: string;
}

export const uvs: UV[] = [
  {
    code: "PROG-101",
    libelle: "Introduction à la Programmation",
    description: "Bases de la programmation",
    presentationEcrite: "Découverte des variables, conditions, boucles",
    lienTeaserUV: "https://example.com/teaser-prog101",
    coefficient: 2,
    eliminatoire: "N",
    noteValidation: 10,
    ordre: 1,
  },
  {
    code: "WEB-201",
    libelle: "Développement Web",
    description: "HTML, CSS, JS",
    presentationEcrite: "Construire des interfaces web",
    lienTeaserUV: "https://example.com/teaser-web201",
    coefficient: 3,
    eliminatoire: "O",
    noteValidation: 12,
    ordre: 2,
  },
];

export const cours: Cours[] = [
  {
    code: "JS-BASICS",
    libelle: "JavaScript Fondamentaux",
    description: "Syntaxe JS, types, fonctions",
    presentationEcrite: "Cours d'introduction JS",
    lienTeaserCours: "https://example.com/teaser-js",
    lienPlaylistCours: "https://example.com/playlist-js",
    uvCode: "WEB-201",
    enseignant: "martin.dubois",
    coefficient: 1,
    ordre: 1,
  },
  {
    code: "ALGO-INTRO",
    libelle: "Algorithmique",
    description: "Structures et algorithmes",
    presentationEcrite: "Algo de base",
    lienTeaserCours: "https://example.com/teaser-algo",
    lienPlaylistCours: "https://example.com/playlist-algo",
    uvCode: "PROG-101",
    enseignant: "sarah.johnson",
    coefficient: 2,
    ordre: 1,
  },
  {
    code: "REACT-ADV",
    libelle: "React Avancé",
    description: "Hooks avancés, contexte, performances et optimisations React",
    presentationEcrite: "Maîtrisez les concepts avancés de React",
    lienTeaserCours: "https://example.com/teaser-react-adv",
    lienPlaylistCours: "https://example.com/playlist-react-adv",
    uvCode: "WEB-201",
    enseignant: "martin.dubois",
    coefficient: 2,
    ordre: 2,
  },
  {
    code: "NODE-API",
    libelle: "API REST avec Node.js",
    description: "Création d'APIs RESTful avec Express, MongoDB et authentification",
    presentationEcrite: "Développez des APIs robustes avec Node.js",
    lienTeaserCours: "https://example.com/teaser-node-api",
    lienPlaylistCours: "https://example.com/playlist-node-api",
    uvCode: "WEB-201",
    enseignant: "martin.dubois",
    coefficient: 3,
    ordre: 3,
  },
  {
    code: "SQL-ADV",
    libelle: "SQL Avancé",
    description: "Requêtes complexes, optimisations, transactions et procédures stockées",
    presentationEcrite: "Maîtrisez les requêtes SQL complexes",
    lienTeaserCours: "https://example.com/teaser-sql-adv",
    lienPlaylistCours: "https://example.com/playlist-sql-adv",
    uvCode: "DATA-201",
    enseignant: "sarah.johnson",
    coefficient: 2,
    ordre: 2,
  },
];

export const modulesCours: ModuleCours[] = [
  {
    code: "DOM-01",
    libelle: "Manipulation du DOM",
    description: "DOM et événements",
    presentationEcrite: "Sélecteurs, events",
    lienTeaserModule: "https://example.com/teaser-dom",
    lienPlaylistModule: "https://example.com/playlist-dom",
    coursCode: "JS-BASICS",
    ordre: 1,
  },
  {
    code: "ALGO-STRUCT",
    libelle: "Structures de données",
    description: "Listes, piles, files",
    presentationEcrite: "Implémentations simples",
    lienTeaserModule: "https://example.com/teaser-struct",
    lienPlaylistModule: "https://example.com/playlist-struct",
    coursCode: "ALGO-INTRO",
    ordre: 1,
  },
];

export const lecons: Lecon[] = [
  {
    code: "DOM-QS",
    libelle: "querySelector & events",
    description: "Sélection et écoute d'événements",
    presentationEcrite: "addEventListener",
    lienTeaserLecon: "https://example.com/teaser-qs",
    lienPlaylistLecon: "https://example.com/playlist-qs",
    moduleCode: "DOM-01",
    ordre: 1,
  },
  {
    code: "PILE-BASE",
    libelle: "Pile",
    description: "Push/Pop",
    presentationEcrite: "Stack intro",
    lienTeaserLecon: "https://example.com/teaser-pile",
    lienPlaylistLecon: "https://example.com/playlist-pile",
    moduleCode: "ALGO-STRUCT",
    ordre: 1,
  },
];

export const bibliotheques: Bibliotheque[] = [
  {
    code: "BIB-JS",
    libelle: "Bibliothèque JavaScript",
    description: "Docs JS",
    presentationEcrite: "Références JS",
    ordre: 1,
  },
  {
    code: "BIB-ALGO",
    libelle: "Bibliothèque Algorithmique",
    description: "Docs algo",
    presentationEcrite: "Références algo",
    ordre: 2,
  },
];

export const ressources: Ressource[] = [
  {
    code: "RES-JS-01",
    libelle: "Guide JS PDF",
    description: "Bases JS",
    presentationEcrite: "PDF introductif",
    typeRessource: "PDF",
    cheminRessource: "/docs/js.pdf",
    bibliothequeCode: "BIB-JS",
    ordre: 1,
  },
  {
    code: "RES-ALGO-01",
    libelle: "Algo playlist",
    description: "Vidéos algo",
    presentationEcrite: "Playlist YouTube",
    typeRessource: "URL",
    cheminRessource: "https://example.com/algo",
    bibliothequeCode: "BIB-ALGO",
    ordre: 1,
  },
];

export const liensContenuBibliotheques: LienContenuBibliotheque[] = [
  { contenuType: "UV", contenuCode: "WEB-201", bibliothequeCode: "BIB-JS" },
  { contenuType: "Cours", contenuCode: "ALGO-INTRO", bibliothequeCode: "BIB-ALGO" },
  { contenuType: "Module", contenuCode: "DOM-01", bibliothequeCode: "BIB-JS" },
  { contenuType: "Lecon", contenuCode: "PILE-BASE", bibliothequeCode: "BIB-ALGO" },
];

export const liensContenuSections: LienContenuSection[] = [
  { contenuType: "Cours", contenuCode: "JS-BASICS", sectionCode: "HOOKS" },
  { contenuType: "Module", contenuCode: "ALGO-STRUCT", sectionCode: "PG" },
];

// -------------------------
// Formations proposées (front-only)
// -------------------------

export type FormationType = "payante" | "gratuite";
export type Niveau = 1 | 2 | 3; // 1 = débutant, 2 = intermédiaire, 3 = avancé

export interface Formation {
  id: string;
  titre: string;
  themeCode: string;
  sousThemeCode?: string;
  niveau: Niveau;
  type: FormationType;
  resume: string;
}

export const formations: Formation[] = [
  {
    id: "F-001",
    titre: "Démarrer avec React",
    themeCode: "DEV",
    sousThemeCode: "REACT",
    niveau: 1,
    type: "gratuite",
    resume: "Introduction aux composants et hooks.",
  },
  {
    id: "F-002",
    titre: "Node.js et Express",
    themeCode: "DEV",
    sousThemeCode: "NODE",
    niveau: 2,
    type: "payante",
    resume: "API REST avec Express et middleware.",
  },
  {
    id: "F-003",
    titre: "SQL pour débutants",
    themeCode: "DATA",
    sousThemeCode: "SQL",
    niveau: 3,
    type: "gratuite",
    resume: "Requêtes SELECT, JOIN, agrégations.",
  },
  {
    id: "F-004",
    titre: "UX Essentials",
    themeCode: "DESIGN",
    sousThemeCode: "UX",
    niveau: 2,
    type: "payante",
    resume: "Recherche utilisateur et wireframes.",
  },
];

// -------------------------
// Quizzes (front-only, pour l'étudiant)
// -------------------------

export type QuizOption = { id: string; text: string; isCorrect: boolean; points: number };
export type QuizQuestion = { id: string; text: string; options: QuizOption[] };
export interface Quiz {
  id: string;
  titre: string;
  actif: boolean;
  questions: QuizQuestion[];
}

export const quizzesActifs: Quiz[] = [
  {
    id: "QZ-REACT-1",
    titre: "React - Fondamentaux",
    actif: true,
    questions: [
      {
        id: "q1",
        text: "Quels hooks sont fournis par React par défaut ?",
        options: [
          { id: "q1o1", text: "useState", isCorrect: true, points: 2 },
          { id: "q1o2", text: "useEffect", isCorrect: true, points: 2 },
          { id: "q1o3", text: "useStore", isCorrect: false, points: 0 },
          { id: "q1o4", text: "useReducer", isCorrect: true, points: 2 },
        ],
      },
      {
        id: "q2",
        text: "Quelle est la bonne façon de mémoriser une valeur calculée ?",
        options: [
          { id: "q2o1", text: "useMemo", isCorrect: true, points: 4 },
          { id: "q2o2", text: "useCallback", isCorrect: false, points: 0 },
          { id: "q2o3", text: "memo()", isCorrect: false, points: 0 },
        ],
      },
    ],
  },
  {
    id: "QZ-SQL-1",
    titre: "SQL - Bases",
    actif: true,
    questions: [
      {
        id: "q1",
        text: "Lesquelles sont des clauses SQL ?",
        options: [
          { id: "s1", text: "SELECT", isCorrect: true, points: 2 },
          { id: "s2", text: "WHERE", isCorrect: true, points: 2 },
          { id: "s3", text: "FILTER", isCorrect: false, points: 0 },
          { id: "s4", text: "JOIN", isCorrect: true, points: 2 },
        ],
      },
    ],
  },
];
