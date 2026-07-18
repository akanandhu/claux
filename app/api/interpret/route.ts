import { NextResponse } from "next/server.js";

import { interpretRequestSchema } from "../../../schemas/contract.ts";
import { interpretFindings } from "../../../features/analysis/server/route-analysis.ts";

export async function POST(request: Request) {
  try {
    const payload = interpretRequestSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json(
        { error: "A confirmed reviewing party is required.", issues: payload.error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(await interpretFindings(payload.data));
  } catch {
    return NextResponse.json(
      { error: "Role-aware interpretation failed without storing server-side state." },
      { status: 500 },
    );
  }
}
