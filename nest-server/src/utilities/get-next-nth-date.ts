/**
 * It return the `next date` of upcomming nth date
 */
export function getNextNthDate(dateth: number): Date {
  return new Date(Date.now() + dateth * 24 * 60 * 60 * 1000);
}
