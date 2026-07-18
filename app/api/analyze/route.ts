import { NextResponse } from "next/server.js";

import { analyzeRequestSchema } from "../../../schemas/contract.ts";
import { analyzeClauses } from "../../../features/analysis/server/route-analysis.ts";

export async function POST(request: Request) {
  try {
    const payload = analyzeRequestSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json(
        { error: "Invalid analysis request.", issues: payload.error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(await analyzeClauses(payload.data));
  } catch {
    return NextResponse.json(
      { error: "Contract analysis failed without storing server-side state." },
      { status: 500 },
    );
  }
}
