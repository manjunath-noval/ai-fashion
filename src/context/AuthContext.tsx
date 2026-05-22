"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "../firebase/config";

type AuthContextType = {
  user: User | null;
};

const AuthContext =
  createContext<AuthContextType>({
    user: null,
  });

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(auth, (currentUser) => {

        setUser(currentUser);

      });

    return () => unsubscribe();

  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);