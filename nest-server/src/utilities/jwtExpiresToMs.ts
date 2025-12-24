export function jwtExpiresInToMs(expiresIn: string | number): number {
  if (typeof expiresIn === 'number') {
    // jwt numeric expiresIn is in seconds
    return expiresIn * 1000;
  }

  const match = expiresIn.match(/^(\d+)([smhdw])$/);

  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    case 'w':
      return value * 7 * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unsupported expiresIn unit: ${unit}`);
  }
}
