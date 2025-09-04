export const APP_CONFIG = {
  name: "Next.js Minimal App",
  description: "A minimal Next.js application with TypeScript, TanStack Query, and MongoDB",
  version: "0.1.0",
} as const;

export const QUERY_KEYS = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
} as const;

export const API_ENDPOINTS = {
  users: "/users",
  user: (id: string) => `/users/${id}`,
} as const;