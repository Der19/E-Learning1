export type UserRole = "admin" | "teacher" | "student" | "client";

export interface AuthUser {
  email: string;
  role: UserRole;
}

type UserRecord = {
  email: string;
  password: string;
  role: UserRole;
  redirectPath: string;
};

const AUTH_STORAGE_KEY = "auth:user";

// Default front-only users
const USERS: UserRecord[] = [
  {
    email: "admin@edu.local",
    password: "admin123",
    role: "admin",
    redirectPath: "/admin",
  },
  {
    email: "teacher@edu.local",
    password: "teacher123",
    role: "teacher",
    redirectPath: "/teacher",
  },
  {
    email: "student@edu.local",
    password: "student123",
    role: "student",
    redirectPath: "/student",
  },
  {
    email: "client@edu.local",
    password: "client123",
    role: "client",
    redirectPath: "/client",
  },
];

export function login(email: string, password: string): { user: AuthUser; redirectPath: string } | null {
  const found = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!found) return null;

  const user: AuthUser = { email: found.email, role: found.role };
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch {}
  return { user, redirectPath: found.redirectPath };
}

export function logout(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getDefaultCredentials(): Array<{ email: string; password: string; role: UserRole; path: string }> {
  return USERS.map((u) => ({ email: u.email, password: u.password, role: u.role, path: u.redirectPath }));
}


