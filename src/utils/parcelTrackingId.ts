import crypto from "crypto";
export function generateTrackingId(email: string): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const hash = crypto
    .createHash("md5")
    .update(email.toLowerCase())
    .digest("hex");
  const lettersOnly = hash.replace(/[^a-zA-Z]/g, "");
  const suffix = lettersOnly.slice(0, 5).toUpperCase().padEnd(5, "X");
  return `TRK-${datePart}-${suffix}`;
}
