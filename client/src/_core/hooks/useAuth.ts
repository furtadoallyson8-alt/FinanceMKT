import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Mock user for static hosting
const MOCK_USER = {
  id: 1,
  openId: "local-user",
  name: "Usuário Local",
  email: "user@localhost",
  loginMethod: "local",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export function useAuth(options?: UseAuthOptions) {
  const logout = useCallback(async () => {
    localStorage.removeItem("manus-runtime-user-info");
  }, []);

  const state = useMemo(() => {
    // Always use mock user for static hosting
    const user = MOCK_USER;
    localStorage.setItem("manus-runtime-user-info", JSON.stringify(user));
    
    return {
      user,
      loading: false,
      error: null,
      isAuthenticated: true,
    };
  }, []);

  return {
    ...state,
    refresh: () => Promise.resolve(),
    logout,
  };
}
