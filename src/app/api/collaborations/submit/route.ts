import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { collaborationApplicationSchema } from "@/lib/validation";
import { normalizeXHandle } from "@/lib/x-handle";
import { generateCollabReferenceCode } from "@/lib/utils";
import { checkRateLimit, hashIdentifier } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const rateKey = hashIdentifier(`collab:${ip}`);
    const rateCheck = checkRateLimit(rateKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true, referenceCode: "COL-FAKE00" });
    }

    const parsed = collaborationApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createServiceClient();
    const referenceCode = generateCollabReferenceCode();
    const xNormalized = normalizeXHandle(data.xHandle);

    const { data: application, error } = await supabase
      .from("collaboration_applications" as "applications")
      .insert({
        reference_code: referenceCode,
        collection_name: data.collectionName.trim(),
        website: data.website?.trim() || null,
        x_handle: `@${xNormalized}`,
        x_handle_normalized: xNormalized,
        discord: data.discord?.trim() || null,
        collection_size: data.collectionSize?.trim() || null,
        blockchain: data.blockchain?.trim() || null,
        collaboration_pitch: data.collaborationPitch.trim(),
        spots_requested: data.spotsRequested ?? null,
        additional_notes: data.additionalNotes?.trim() || null,
        dream_collaborations: data.dreamCollaborations?.trim() || null,
        status: "pending",
        submission_source: "web",
        submission_ip_hash: rateKey,
      } as never)
      .select("reference_code")
      .single();

    if (error) {
      console.error("Collaboration insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceCode: (application as { reference_code: string }).reference_code,
    });
  } catch (err) {
    console.error("Collaboration submission error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
