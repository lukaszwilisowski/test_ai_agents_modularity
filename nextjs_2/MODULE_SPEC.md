# Module System Specification

## Overview

This document provides comprehensive instructions for adding and removing product modules in the Next.js Multi-Category Store application. Each module represents a distinct product category with full CRUD functionality, following a consistent architectural pattern.

## Architecture Pattern

The application uses a **modular architecture** where each product category is an independent module with the same structure:

```
Module (e.g., "guitars", "toys", "cars")
├── Database Schema (MongoDB collection)
├── API Routes (CRUD endpoints)
├── Zod Schemas (validation & types)
├── TanStack Query Hooks (data fetching)
├── React Components (UI)
├── Pages (listing & detail views)
└── Homepage Integration (navigation card)
```

---

## Adding a New Module

Follow these steps to add a new product module (e.g., "books", "shoes", "electronics").

### Step 1: Create the Zod Schema

**File**: `src/models/schemas/{module}.schema.ts`

```typescript
import { z } from "zod";

// Define the main schema with all fields
export const {Module}Schema = z.object({
  _id: z.string(),
  name: z.string().min(1, "{Module} name is required"),
  brand: z.string().min(1, "Brand is required"),
  // Add category/type field specific to your module
  category: z.enum(["category1", "category2", "category3"]),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0, "Stock count cannot be negative"),
  // Add module-specific fields
  specifications: z.object({
    // Add specification fields here
    field1: z.string().optional(),
    field2: z.number().optional(),
  }),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

// Schema for creating (omits auto-generated fields)
export const Create{Module}Schema = {Module}Schema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating (all fields optional)
export const Update{Module}Schema = Create{Module}Schema.partial();

// Export TypeScript types
export type {Module} = z.infer<typeof {Module}Schema>;
export type Create{Module} = z.infer<typeof Create{Module}Schema>;
export type Update{Module} = z.infer<typeof Update{Module}Schema>;
```

**Example fields to consider:**
- Basic: `name`, `brand`, `price`, `description`, `imageUrl`
- Inventory: `inStock`, `stockCount`
- Categorization: `category`, `type`, `tags`
- Module-specific: `ageRange` (toys), `size` (clothing), `author` (books)
- Metadata: `createdAt`, `updatedAt`

### Step 2: Export the Schema

**File**: `src/models/schemas/index.ts`

Add the export line:
```typescript
export * from "./{module}.schema";
```

Types are automatically exported via `src/models/types/index.ts`.

### Step 3: Create API Routes

#### Main Collection Route

**File**: `src/app/api/{modules}/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { Create{Module}Schema, {Module}Schema } from "@/models/schemas";
import { ObjectId } from "mongodb";

// GET all items
export async function GET() {
  try {
    const collection = await getCollection("{modules}");
    const items = await collection.find({}).toArray();

    const parsedItems = items.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    const validatedItems = {Module}Schema.array().parse(parsedItems);

    return NextResponse.json({
      success: true,
      data: validatedItems,
    });
  } catch (error) {
    console.error("Error fetching {modules}:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch {modules}" },
      { status: 500 }
    );
  }
}

// POST new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = Create{Module}Schema.parse(body);

    const collection = await getCollection("{modules}");
    const now = new Date();

    const itemToInsert = {
      ...validatedData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(itemToInsert);

    const createdItem = {
      ...itemToInsert,
      _id: result.insertedId.toString(),
      createdAt: itemToInsert.createdAt.toISOString(),
      updatedAt: itemToInsert.updatedAt.toISOString(),
    };

    const validatedItem = {Module}Schema.parse(createdItem);

    return NextResponse.json({
      success: true,
      data: validatedItem,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating {module}:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid {module} data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create {module}" },
      { status: 500 }
    );
  }
}
```

#### Single Item Route

**File**: `src/app/api/{modules}/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { {Module}Schema, Update{Module}Schema } from "@/models/schemas";
import { ObjectId } from "mongodb";

// GET single item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid {module} ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("{modules}");
    const item = await collection.findOne({ _id: new ObjectId(id) });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "{Module} not found" },
        { status: 404 }
      );
    }

    const parsedItem = {
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };

    const validatedItem = {Module}Schema.parse(parsedItem);

    return NextResponse.json({
      success: true,
      data: validatedItem,
    });
  } catch (error) {
    console.error("Error fetching {module}:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch {module}" },
      { status: 500 }
    );
  }
}

// PUT update item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid {module} ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = Update{Module}Schema.parse(body);

    const collection = await getCollection("{modules}");
    const now = new Date();

    const updateData = {
      ...validatedData,
      updatedAt: now,
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, error: "{Module} not found" },
        { status: 404 }
      );
    }

    const parsedItem = {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };

    const validatedItem = {Module}Schema.parse(parsedItem);

    return NextResponse.json({
      success: true,
      data: validatedItem,
    });
  } catch (error) {
    console.error("Error updating {module}:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid {module} data", details: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update {module}" },
      { status: 500 }
    );
  }
}

// DELETE item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid {module} ID" },
        { status: 400 }
      );
    }

    const collection = await getCollection("{modules}");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "{Module} not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "{Module} deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting {module}:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete {module}" },
      { status: 500 }
    );
  }
}
```

### Step 4: Create TanStack Query Hooks

#### Query Hooks

**File**: `src/hooks/queries/use-{modules}-query.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { {Module}Schema } from "@/models/schemas";

// Fetch all items
export const use{Modules}Query = () => {
  return useQuery({
    queryKey: ["{modules}"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>("/{modules}");
      if (!response.success) {
        throw new Error("Failed to fetch {modules}");
      }
      return {Module}Schema.array().parse(response.data);
    },
  });
};

// Fetch single item
export const use{Module}Query = (id: string) => {
  return useQuery({
    queryKey: ["{modules}", id],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: unknown }>(`/{modules}/${id}`);
      if (!response.success) {
        throw new Error("Failed to fetch {module}");
      }
      return {Module}Schema.parse(response.data);
    },
    enabled: !!id,
  });
};
```

#### Mutation Hooks

**File**: `src/hooks/mutations/use-{modules}-mutation.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Create{Module}Schema, Update{Module}Schema, {Module}Schema } from "@/models/schemas";
import type { Create{Module}, Update{Module} } from "@/models/types";

// Create mutation
export const useCreate{Module}Mutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemData: Create{Module}) => {
      const validatedData = Create{Module}Schema.parse(itemData);
      const response = await api.post<{ success: boolean; data: unknown }>("/{modules}", validatedData);
      if (!response.success) {
        throw new Error("Failed to create {module}");
      }
      return {Module}Schema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["{modules}"] });
    },
  });
};

// Update mutation
export const useUpdate{Module}Mutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, itemData }: { id: string; itemData: Update{Module} }) => {
      const validatedData = Update{Module}Schema.parse(itemData);
      const response = await api.put<{ success: boolean; data: unknown }>(`/{modules}/${id}`, validatedData);
      if (!response.success) {
        throw new Error("Failed to update {module}");
      }
      return {Module}Schema.parse(response.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["{modules}"] });
      queryClient.invalidateQueries({ queryKey: ["{modules}", variables.id] });
    },
  });
};

// Delete mutation
export const useDelete{Module}Mutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<{ success: boolean }>(`/{modules}/${id}`);
      if (!response.success) {
        throw new Error("Failed to delete {module}");
      }
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["{modules}"] });
      queryClient.removeQueries({ queryKey: ["{modules}", id] });
    },
  });
};
```

#### Export Hooks

**File**: `src/hooks/queries/index.ts`
```typescript
export * from "./use-{modules}-query";
```

**File**: `src/hooks/mutations/index.ts`
```typescript
export * from "./use-{modules}-mutation";
```

### Step 5: Create the Tile Component

**File**: `src/components/custom/{module}-tile.tsx`

```typescript
import Link from "next/link";
import type { {Module} } from "@/models/types";

interface {Module}TileProps {
  item: {Module};
}

export function {Module}Tile({ item }: {Module}TileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border">
      {/* Image */}
      <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="space-y-2">
        {/* Name & Brand */}
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg truncate">{item.name}</h3>
          <span className="text-sm text-gray-500">{item.brand}</span>
        </div>

        {/* Price & Stock Status */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${item.price}</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.inStock
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {item.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Module-specific info (customize as needed) */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{item.category}</span>
          <span>{item.stockCount} available</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>

        {/* View Details Button */}
        <Link
          href={`/{modules}/${item._id}` as any}
          className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center mt-3"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
```

**Note**: Use `as any` on the Link href to work around Next.js typed routes limitation with dynamic IDs.

### Step 6: Create the Listing Page

**File**: `src/app/{modules}/page.tsx`

```typescript
"use client";

import { use{Modules}Query } from "@/hooks/queries";
import { useCreate{Module}Mutation } from "@/hooks/mutations";
import { {Module}Tile } from "@/components/custom/{module}-tile";
import Link from "next/link";

export default function {Modules}Page() {
  const { data: items, isLoading, error } = use{Modules}Query();
  const createMutation = useCreate{Module}Mutation();

  const handleAddExample = () => {
    const exampleItem = {
      name: "Example {Module}",
      brand: "Example Brand",
      category: "category1" as const,
      price: 99.99,
      description: "This is an example {module} for testing purposes.",
      imageUrl: "https://images.unsplash.com/photo-1234567890?w=400&h=300&fit=crop",
      inStock: true,
      stockCount: 10,
      specifications: {
        // Add example specifications
      },
    };

    createMutation.mutate(exampleItem);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading {modules}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load {modules}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{Modules}</h1>
          <p className="text-gray-600">Discover our amazing collection of {modules}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddExample}
            disabled={createMutation.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Adding..." : "Add Example"}
          </button>
          <Link
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {!items || items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No {modules} available at the moment</p>
          <p className="text-sm text-gray-500">Check back later for new arrivals</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <{Module}Tile key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 7: Add Homepage Card

**File**: `src/app/page.tsx`

Add a new card to the grid:

```typescript
{/* {Module} Module Card */}
<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
    <div className="text-4xl">🎯</div> {/* Choose appropriate emoji */}
  </div>
  <h2 className="text-xl font-semibold mb-2">{Modules}</h2>
  <p className="text-gray-600 mb-4">
    Brief description of your {modules} collection
  </p>
  <Link
    href="/{modules}"
    className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
  >
    Shop {Modules}
  </Link>
</div>
```

### Step 8: Build and Test

```bash
# Build the project to check for errors
npm run build

# Run the development server
npm run dev

# Test the module:
# 1. Visit http://localhost:3000
# 2. Click on the module card
# 3. Test "Add Example" button
# 4. Verify CRUD operations work
```

---

## Removing a Module

To completely remove a module from the application:

### Step 1: Delete Schema Files

```bash
rm src/models/schemas/{module}.schema.ts
```

Remove the export from `src/models/schemas/index.ts`:
```typescript
// Delete this line:
export * from "./{module}.schema";
```

### Step 2: Delete API Routes

```bash
rm -rf src/app/api/{modules}
```

This removes both `route.ts` and `[id]/route.ts` files.

### Step 3: Delete Hook Files

```bash
rm src/hooks/queries/use-{modules}-query.ts
rm src/hooks/mutations/use-{modules}-mutation.ts
```

Remove exports from index files:
- `src/hooks/queries/index.ts`
- `src/hooks/mutations/index.ts`

### Step 4: Delete Components

```bash
rm src/components/custom/{module}-tile.tsx
```

If you created additional components (detail, form), delete those too.

### Step 5: Delete Pages

```bash
rm -rf src/app/{modules}
```

### Step 6: Update Homepage

**File**: `src/app/page.tsx`

Remove the module's card from the homepage grid.

### Step 7: Clean Database (Optional)

If you want to remove the data from MongoDB:

```javascript
// In MongoDB shell or using a script
db.{modules}.drop()
```

### Step 8: Verify Removal

```bash
# Build to check for broken imports
npm run build

# Search for remaining references
grep -r "{module}" src/
grep -r "{Module}" src/
```

---

## Module Naming Conventions

### File Naming
- **Lowercase plural** for directories: `guitars/`, `toys/`, `books/`
- **Lowercase singular** for schemas: `guitar.schema.ts`, `toy.schema.ts`
- **Lowercase singular** for components: `guitar-tile.tsx`, `toy-tile.tsx`
- **Lowercase plural** for hooks: `use-guitars-query.ts`, `use-toys-mutation.ts`

### Code Naming
- **PascalCase singular** for types/schemas: `Guitar`, `GuitarSchema`, `CreateGuitar`
- **camelCase plural** for hook names: `useGuitarsQuery()`, `useToysQuery()`
- **camelCase singular** for mutation names: `useCreateGuitarMutation()`
- **lowercase plural** for API routes: `/api/guitars`, `/api/toys`
- **lowercase plural** for query keys: `["guitars"]`, `["toys"]`

### Variable Naming in Templates
When using the templates above, replace:
- `{module}` → lowercase singular (e.g., "guitar", "toy")
- `{Module}` → PascalCase singular (e.g., "Guitar", "Toy")
- `{modules}` → lowercase plural (e.g., "guitars", "toys")
- `{Modules}` → PascalCase plural (e.g., "Guitars", "Toys")

---

## Example Modules

Here are the currently implemented modules for reference:

| Module | Collection | Category Field | Theme Color | Icon |
|--------|-----------|----------------|-------------|------|
| Guitars | `guitars` | `type` (acoustic/electric/bass) | Blue | 🎸 |
| Toys | `toys` | `category` (8 types) | Purple | 🧸 |
| Cars | `cars` | `type` | Blue | 🚗 |
| TVs | `tvs` | `type` | Blue | 📺 |
| Computers | `computers` | `type` (laptop/desktop) | Blue | 💻 |

---

## Best Practices

### Schema Design
1. **Always include base fields**: `_id`, `name`, `brand`, `price`, `description`, `imageUrl`, `inStock`, `stockCount`, `createdAt`, `updatedAt`
2. **Use enums for categories**: Prevents typos and enables type safety
3. **Optional specifications**: Keep in nested `specifications` object
4. **Validation messages**: Provide clear, user-friendly error messages

### API Routes
1. **Always validate input**: Use Zod schemas for all request bodies
2. **Proper error handling**: Return appropriate HTTP status codes
3. **Consistent responses**: Use `{ success: boolean, data?: any, error?: string }` format
4. **ID validation**: Check `ObjectId.isValid()` before database queries

### React Hooks
1. **Query invalidation**: Always invalidate queries after mutations
2. **Error handling**: Let TanStack Query handle errors naturally
3. **Loading states**: Use `isLoading` and `isPending` appropriately
4. **Optimistic updates**: Consider for better UX (advanced)

### Components
1. **Type safety**: Always type props with module-specific types
2. **Responsive design**: Use Tailwind responsive classes
3. **Accessibility**: Include alt text, proper semantic HTML
4. **Loading states**: Show spinners during data fetching
5. **Error boundaries**: Handle errors gracefully

### Testing Checklist
- [ ] Schema validates correct data
- [ ] Schema rejects invalid data
- [ ] GET all items works
- [ ] GET single item works
- [ ] POST creates item correctly
- [ ] PUT updates item correctly
- [ ] DELETE removes item correctly
- [ ] Loading states display properly
- [ ] Error states display properly
- [ ] Homepage card links correctly
- [ ] "Add Example" button works
- [ ] Build completes without errors

---

## Common Issues & Solutions

### TypeScript Errors with Link href

**Problem**: Type error with dynamic routes like `/guitars/${id}`

**Solution**: Use type assertion `as any`
```typescript
<Link href={`/guitars/${guitar._id}` as any}>
```

### Zod Validation Fails

**Problem**: API returns 400 with validation error

**Solution**: Check schema matches your data structure. Use `.optional()` for optional fields.

### Query Not Updating After Mutation

**Problem**: UI doesn't refresh after create/update/delete

**Solution**: Ensure you call `queryClient.invalidateQueries()` in mutation's `onSuccess`

### MongoDB Connection Issues

**Problem**: Can't connect to database

**Solution**: Check `MONGODB_URI` in `.env` file and verify MongoDB is running

### Build Fails with Import Errors

**Problem**: Can't find module after adding new files

**Solution**: Ensure you've exported from index files:
- `src/models/schemas/index.ts`
- `src/hooks/queries/index.ts`
- `src/hooks/mutations/index.ts`

---

## Architecture Decisions

### Why This Pattern?

1. **Modularity**: Each product category is independent and can be added/removed easily
2. **Type Safety**: Zod provides runtime validation + TypeScript types from single source
3. **Consistency**: Same structure for all modules reduces cognitive load
4. **Scalability**: Easy to add new modules without refactoring existing code
5. **Maintainability**: Clear separation of concerns (data, API, UI, state)

### Technology Choices

- **Zod**: Runtime validation + type generation from single schema
- **TanStack Query**: Automatic caching, loading states, error handling
- **Next.js App Router**: File-based routing, API routes, server components
- **MongoDB**: Flexible schema for diverse product types
- **Tailwind CSS**: Rapid UI development with consistent design

---

## Future Enhancements

Consider implementing these features across all modules:

### High Priority
1. **Detail pages**: `/[module]/[id]` for individual product views
2. **Pagination**: Handle large datasets efficiently
3. **Search & filter**: Improve user experience with many products
4. **Image optimization**: Use Next.js Image component

### Medium Priority
5. **Admin interface**: UI for managing products
6. **Category filtering**: Filter by product categories
7. **Sorting options**: Price, name, date added
8. **Shopping cart**: E-commerce functionality

### Low Priority
9. **Product comparison**: Compare multiple items side-by-side
10. **Reviews & ratings**: User-generated content
11. **Related products**: Recommendation system
12. **SEO optimization**: Meta tags, structured data

---

## Summary

This module system provides a **scalable, type-safe, and maintainable** architecture for adding product categories to the application. Each module follows the same pattern, making it easy to:

✅ Add new product categories in ~30 minutes
✅ Remove modules cleanly without breaking other code
✅ Maintain consistency across the application
✅ Scale to dozens of product categories
✅ Onboard new developers quickly

For questions or issues, refer to existing modules (guitars, toys) as working examples.
