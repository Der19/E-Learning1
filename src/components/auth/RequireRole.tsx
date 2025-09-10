import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser, UserRole } from "@/lib/auth";

interface Props {
  role: UserRole;
  children: ReactNode;
}

export function RequireRole({ role, children }: Props) {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}




