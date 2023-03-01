export default function normalizeEmail(email: string): string {
  return email.trim().replace(/^ /g, '').replace(/ $/g, '').toLowerCase();
}
