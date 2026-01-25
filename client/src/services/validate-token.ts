export default function validateToken({
  token,
  expiresAt,
}: {
  token: string | null;
  expiresAt: number | null;
}): boolean {
  if (!token || !expiresAt) return false;

  const now = Date.now();
  return now < expiresAt;
}
