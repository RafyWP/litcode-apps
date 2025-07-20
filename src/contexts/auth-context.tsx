
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getAccessToken } from "@/app/actions";

const TOKEN_KEY = "tiktok_auth_data";

interface AuthData {
  token: string;
  expiresAt: number;
}

interface AuthContextType {
  accessToken: string | null;
  isLoading: boolean;
  pixelId: string | null;
  advertiserId: string | null;
  pixelCode: string | null;
  eventSent: boolean;
  login: (authCode: string) => Promise<void>;
  logout: () => void;
  setPixelId: (id: string | null) => void;
  setAdvertiserId: (id: string | null) => void;
  setPixelCode: (code: string | null) => void;
  setEventSent: (sent: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the tool's progress
  const [pixelId, setPixelId] = useState<string | null>(null);
  const [advertiserId, setAdvertiserId] = useState<string | null>(null);
  const [pixelCode, setPixelCode] = useState<string | null>(null);
  const [eventSent, setEventSent] = useState(false);


  useEffect(() => {
    try {
      const storedData = localStorage.getItem(TOKEN_KEY);
      if (storedData) {
        const { token, expiresAt }: AuthData = JSON.parse(storedData);
        if (new Date().getTime() < expiresAt) {
          setAccessToken(token);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch (e) {
      // Could be SSR or disabled localStorage
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (authCode: string) => {
    setIsLoading(true);
    try {
      const result = await getAccessToken({ authCode });

      if (result.success && result.data.access_token) {
        const { access_token, expires_in } = result.data;
        const expiresInSeconds = expires_in || 86400; // Default to 24h
        const expiresInMs = expiresInSeconds * 1000;
        const expiresAt = new Date().getTime() + expiresInMs;

        const authData: AuthData = { token: access_token, expiresAt };
        localStorage.setItem(TOKEN_KEY, JSON.stringify(authData));
        setAccessToken(access_token);
      } else {
        throw new Error(result.error || "Failed to retrieve access token.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAccessToken(null);
    setPixelId(null);
    setAdvertiserId(null);
    setPixelCode(null);
    setEventSent(false);
  }, []);

  const value = {
    accessToken,
    isLoading,
    login,
    logout,
    pixelId,
    setPixelId,
    advertiserId,
    setAdvertiserId,
    pixelCode,
    setPixelCode,
    eventSent,
    setEventSent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
