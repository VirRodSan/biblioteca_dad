import { AuthProvider } from "../auth/AuthProvider";

export function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}