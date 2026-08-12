import { NextResponse } from "next/server";
import { peekNextApplicationReferenceCode } from "@/lib/application-reference";

export async function GET() {
  try {
    const referenceCode = await peekNextApplicationReferenceCode();
    return NextResponse.json({ referenceCode });
  } catch (err) {
    console.error("Failed to peek next reference code:", err);
    return NextResponse.json({ referenceCode: "PAW-0001" });
  }
}
