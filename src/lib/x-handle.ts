const X_USERNAME_REGEX = /^[a-zA-Z0-9_]{1,15}$/;

export function normalizeXHandle(input: string): string | null {
  if (!input || !input.trim()) return null;

  let handle = input.trim();

  // Extract from URL patterns
  const urlPatterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(@?[\w]+)/i,
    /^@([\w]+)$/,
  ];

  for (const pattern of urlPatterns) {
    const match = handle.match(pattern);
    if (match) {
      handle = match[1].replace("@", "");
      break;
    }
  }

  handle = handle.replace("@", "").trim();

  if (!X_USERNAME_REGEX.test(handle)) {
    return null;
  }

  return handle.toLowerCase();
}

export function isValidXHandle(input: string): boolean {
  if (!input || !input.trim()) return true; // optional field
  return normalizeXHandle(input) !== null;
}

export function xProfileUrl(handle: string): string {
  const normalized = normalizeXHandle(handle) ?? handle.replace("@", "");
  return `https://x.com/${normalized}`;
}

export function formatXDisplay(handle: string): string {
  const normalized = normalizeXHandle(handle);
  return normalized ? `@${normalized}` : handle;
}
