# Next.js Minimal Architecture Specification

## Overview

This specification outlines a minimal, modern Next.js architecture with TypeScript, Biome, shadcn/ui components, TanStack Query, and Zod schemas.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Biome** for linting and formatting
- **shadcn/ui** for UI components
- **TanStack Query** for data fetching
- **Zod** for schema validation
- **Tailwind CSS** for styling

## Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Homepage
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── custom/                  # Custom components
├── hooks/
│   ├── queries/                 # TanStack Query hooks
│   │   ├── use-example-query.ts
│   │   └── index.ts
│   ├── mutations/               # TanStack Query mutations
│   │   ├── use-example-mutation.ts
│   │   └── index.ts
│   └── utils/                   # Custom utility hooks
├── lib/
│   ├── utils.ts                 # General utilities
│   ├── query-client.ts          # TanStack Query client config
│   └── api.ts                   # API client setup
├── models/
│   ├── schemas/                 # Zod schemas
│   │   ├── user.schema.ts
│   │   ├── common.schema.ts
│   │   └── index.ts
│   └── types/                   # TypeScript types (derived from schemas)
│       ├── user.types.ts
│       └── index.ts
└── utils/
    ├── validation.ts            # Validation utilities
    ├── api-helpers.ts           # API utility functions
    └── constants.ts             # Application constants
```

## Configuration Files

### Root Level Files

- `package.json` - Dependencies and scripts
- `biome.json` - Biome configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `components.json` - shadcn/ui configuration

## Key Features

### 1. Type Safety

- Full TypeScript integration
- Zod schemas for runtime validation
- Type inference from schemas

### 2. Data Fetching

- TanStack Query for server state management
- Organized queries and mutations
- Optimistic updates and caching

### 3. UI Components

- shadcn/ui component library
- Consistent design system
- Accessible components

### 4. Code Quality

- Biome for fast linting and formatting
- Consistent code style
- Import organization

### 5. Schema Validation

- Zod schemas for data validation
- Type-safe API contracts
- Client and server validation

## Implementation Details

### Zod Schemas Structure

```typescript
// models/schemas/user.schema.ts
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
```

### TanStack Query Setup

```typescript
// lib/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
    },
  },
});
```

### API Integration

```typescript
// hooks/queries/use-example-query.ts
export const useExampleQuery = () => {
  return useQuery({
    queryKey: ["example"],
    queryFn: async () => {
      const response = await api.get("/example");
      return ExampleSchema.parse(response.data);
    },
  });
};
```

## Development Workflow

1. **Schema First**: Define Zod schemas for data models
2. **Type Generation**: Infer TypeScript types from schemas
3. **API Integration**: Use schemas for validation in queries/mutations
4. **Component Development**: Build UI with shadcn/ui components
5. **State Management**: Implement with TanStack Query

## Questions for Clarification

### Project Scope

1. **Data Source**: Will you be connecting to a REST API, GraphQL endpoint, or mock data?
2. **Authentication**: Do you need user authentication? If so, what type (JWT, OAuth, etc.)?
3. **Database**: Are you planning to use a database? Which one (PostgreSQL, MongoDB, etc.)?

### Features

4. **Homepage Content**: What specific content/features should the homepage include?
5. **Forms**: Will you need forms with validation? What types of forms?
6. **Real-time Features**: Do you need real-time updates (WebSocket, SSE)?

### Deployment & Environment

7. **Deployment Target**: Where will this be deployed (Vercel, AWS, Docker)?
8. **Environment Variables**: What environment-specific configurations do you need?
9. **API Routes**: Do you need Next.js API routes, or is this frontend-only?

### UI/UX Requirements

10. **Design System**: Any specific color scheme, branding, or design requirements?
11. **Responsive Design**: Mobile-first or desktop-first approach?
12. **Accessibility**: Any specific accessibility requirements?

### Data Models

13. **Core Entities**: What are the main data entities you'll be working with?
14. **Relationships**: How do these entities relate to each other?
15. **Validation Rules**: Any specific business rules for data validation?

Please provide answers to these questions so I can refine the specification to better match your project needs.
