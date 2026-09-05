export const localDate = (iso: string | Date) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(iso));

export const jobTime = (iso: string) => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit',
}).format(new Date(iso));

export const jobDate = (iso: string) => new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
  timeZone: 'Asia/Riyadh', weekday: 'long', day: 'numeric', month: 'long',
}).format(new Date(iso));

export function organizeJobs<T extends { scheduled_at: string; technician_id: string | null; status: string }>(
  jobs: T[], userId: string, now = new Date(),
) {
  const today = localDate(now);
  const sorted = [...jobs].sort((a, b) => Date.parse(a.scheduled_at) - Date.parse(b.scheduled_at));
  return {
    today: sorted.filter((job) => localDate(job.scheduled_at) === today || job.status === 'active'),
    upcoming: sorted.filter((job) => localDate(job.scheduled_at) > today && job.status !== 'active'),
    current: sorted.find((job) => job.technician_id === userId && job.status === 'active') ?? null,
  };
}
