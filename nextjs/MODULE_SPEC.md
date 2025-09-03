# Simple Module Specification

## Overview

A simple horizontal architecture where each "module" is just a set of files following naming conventions. No dynamic loading, no complex registration - just standard Next.js patterns.

You can ignore linting errors, do not check for that.

## Module Structure

For a new module (e.g., "guitar"), create these files:

### 1. Database Model

```
src/lib/models/guitar.model.ts
```

### 2. Zod Schemas

```
src/lib/schemas/guitar.schema.ts
```

### 3. API Routes

```
src/app/api/guitar/route.ts
src/app/api/guitar/[id]/route.ts
```

### 4. TanStack Query Hooks

```
src/hooks/use-guitar-query.ts
src/hooks/use-guitar-mutation.ts
```

### 5. React Components

```
src/components/guitar-card.tsx
src/components/guitar-list.tsx
```

### 6. Next.js Page

```
src/app/guitar/page.tsx
```

**Page Features:**

- Display list of module items using the list component
- Test button to verify module endpoint functionality
- Real-time feedback showing API response/errors
- Example data posting to validate the endpoint works

### 7. Add to Homepage

Manually add the module card to `src/app/page.tsx`:

```typescript
import { GuitarCard } from "@/components/guitar-card";

// Add <GuitarCard /> to the grid
```

## That's it!

No registration, no dynamic imports, no module discovery. Just:

1. Create the files following the naming convention
2. Import and use them where needed
3. Add manually to homepage

Simple, predictable, and easy to understand.

## File Templates

### Model Template (`src/lib/models/{name}.model.ts`)

```typescript
import mongoose, { Schema } from "mongoose";
import connectDB from "@/lib/database/connection";

// Define your interface
interface GuitarDocument extends Document {
  name: string;
  price: number;
  // Add specific fields
}

// Define schema
const guitarSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    // Add specific fields
  },
  { timestamps: true }
);

// Create model
const Guitar = mongoose.models.Guitar || mongoose.model("Guitar", guitarSchema);

// Export CRUD functions
export const guitarModel = {
  async findAll() {
    await connectDB();
    return Guitar.find({});
  },

  async create(data: any) {
    await connectDB();
    return Guitar.create(data);
  },
  // Add more methods
};
```

### API Route Template (`src/app/api/{name}/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { guitarModel } from "@/lib/models/guitar.model";

export async function GET() {
  try {
    const items = await guitarModel.findAll();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await guitarModel.create(body);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
```

### Module Page Template (`src/app/{name}/page.tsx`)

```typescript
"use client";

import { ModuleList } from "@/components/module-list";
import { useState } from "react";

export default function ModulePage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testModuleEndpoint = async () => {
    setIsLoading(true);
    try {
      const exampleData = {
        // Define example data matching your schema
        name: "Test Item",
        price: 999,
        // ... other required fields
      };

      const response = await fetch("/api/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exampleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTestResult({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Module Name</h1>
        <p className="text-gray-600 text-lg">Module description</p>
      </div>

      {/* Test Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Module Endpoint Test</h2>
        <button
          onClick={testModuleEndpoint}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md font-medium"
        >
          {isLoading ? "Testing..." : "Add Example Item"}
        </button>

        {testResult && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Test Result:</h3>
            <div
              className={`p-4 rounded-md ${
                testResult.success
                  ? "bg-green-100 border-green-300"
                  : "bg-red-100 border-red-300"
              } border`}
            >
              {testResult.success ? (
                <div>
                  <p className="text-green-800 font-medium">
                    ✅ Success! Item created successfully
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Timestamp: {testResult.timestamp}
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-blue-600">
                      View response data
                    </summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-x-auto">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div>
                  <p className="text-red-800 font-medium">
                    ❌ Error: {testResult.error}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Timestamp: {testResult.timestamp}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ModuleList />
    </div>
  );
}
```

## Testing Your Module

Each module page includes a test button that:

1. Posts example data to the module's POST endpoint
2. Shows real-time feedback (success/error messages)
3. Displays the API response with timestamp
4. Validates that the endpoint is working correctly

This helps verify the module is properly connected and functional.

Simple and straightforward!
