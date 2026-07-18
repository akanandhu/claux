import { IngestionError } from "@/features/ingestion/errors";

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Analysis service rejected the request.");
  }

  return (await response.json()) as T;
}

export function errorMessage(error: unknown) {
  if (error instanceof IngestionError) return error.message;
  if (error instanceof Error) return error.message;
  return "The contract could not be analyzed.";
}

export function yieldToPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}
