const DISCORD_USERNAME_REGEX = /^[\w.]{2,32}$/;

export function sanitizeDiscordUsername(input: string): string {
  return input.trim().replace(/^@/, "");
}

export function isValidDiscordUsername(input: string): boolean {
  if (!input || !input.trim()) return true;
  const cleaned = sanitizeDiscordUsername(input);
  if (cleaned.length < 2 || cleaned.length > 32) return false;
  return DISCORD_USERNAME_REGEX.test(cleaned);
}

export function normalizeDiscordUsername(input: string): string | null {
  if (!input?.trim()) return null;
  const cleaned = sanitizeDiscordUsername(input);
  if (!isValidDiscordUsername(cleaned)) return null;
  return cleaned;
}
