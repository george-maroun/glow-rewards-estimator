export default function getWeeksSinceStart(joiningDate: string): number {
  const genesisTimeInSeconds = 1700352000;
  const start = new Date(genesisTimeInSeconds * 1000);
  let endDate;
  if (!joiningDate) {
    endDate = new Date();
  } else {
    endDate = new Date(joiningDate);
  }
  const diff = endDate.getTime() - start.getTime();
  const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
  return weeks;
}