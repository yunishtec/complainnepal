"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface User {
  uid: string;
  email: string | null;
  username: string;
  is_admin: boolean;
  isProfileSetup?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              username: data.username || '',
              is_admin: data.isAdmin || false,
              isProfileSetup: data.isProfileSetup || false
            });
          } else {
            // User exists in Auth but not in Firestore yet (during signup flow)
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              username: '',
              is_admin: false,
              isProfileSetup: false
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: '',
            is_admin: false
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
