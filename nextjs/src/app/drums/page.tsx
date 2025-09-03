"use client";

import { DrumsList } from "@/components/drums-list";
import { useState } from "react";

export default function DrumsPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testModuleEndpoint = async () => {
    setIsLoading(true);
    try {
      const exampleDrums = {
        name: "Test Drums",
        description: "This is a test drum kit to verify the endpoint works",
        price: 1299,
        brand: "Test Brand",
        drumModel: "Test Model",
        pieces: 5,
        drumType: "acoustic" as const,
        inStock: true,
      };

      const response = await fetch("/api/drums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exampleDrums),
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
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <span className="text-red-500">🥁</span>
          Drums
        </h1>
        <p className="text-gray-600 text-lg">
          Acoustic and electronic drum kits for all styles
        </p>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Module Endpoint Test</h2>
        <button
          onClick={testModuleEndpoint}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md font-medium"
        >
          {isLoading ? "Testing..." : "Add Example Drums"}
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
                    ✅ Success! Drums created successfully
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

      <DrumsList />
    </div>
  );
}
