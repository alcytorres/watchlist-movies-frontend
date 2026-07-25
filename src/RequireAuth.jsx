import { Navigate } from "react-router-dom";

export function RequireAuth({ children }) {
  const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
