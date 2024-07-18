export default function getWeeksSinceStart(joiningDate: string): number {
  const genesisTimeInSeconds = 1700352000;
  const start = new Date(genesisTimeInSeconds * 1000);
  const joinDate = new Date(joiningDate);
  const diff = joinDate.getTime() - start.getTime();
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return weeks;
}