import { NextResponse } from "next/server";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(err: unknown) {
  if (err instanceof Error) {
    if (err.message === "Unauthorized") {
      return jsonError("Unauthorized", 401);
    }
    if (err.message === "Forbidden") {
      return jsonError("Forbidden", 403);
    }
  }
  console.error("API error:", err);
  return jsonError("An unexpected error occurred", 500);
}
