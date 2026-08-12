import { createServiceClient } from "@/lib/supabase/admin";

/** Format a sequential adoption number as PAW-0001 */
export function formatApplicationReferenceCode(sequence: number): string {
  return `PAW-${String(sequence).padStart(4, "0")}`;
}

export async function peekNextApplicationReferenceCode(): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("peek_application_reference_code");

  if (error || !data) {
    return formatApplicationReferenceCode(1);
  }

  return String(data);
}

export async function allocateApplicationReferenceCode(): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.rpc("next_application_reference_code");

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to allocate reference code");
  }

  return String(data);
}
