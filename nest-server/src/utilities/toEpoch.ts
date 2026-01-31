export const toEpoch = (d?: Date | number | null) =>
  d instanceof Date ? d.getTime() : (d ?? undefined);
