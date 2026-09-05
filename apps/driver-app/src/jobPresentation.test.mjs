import assert from 'node:assert/strict';
import { test } from 'node:test';
import { jobTime, localDate, organizeJobs } from './jobPresentation.ts';

test('driver day changes at Saudi midnight, not UTC midnight', () => {
  assert.equal(localDate('2026-09-05T21:01:00Z'), '2026-09-06');
  assert.equal(jobTime('2026-09-05T21:01:00Z'), '00:01');
});

test('ongoing previous-day work stays visible, upcoming work is separate and ordered', () => {
  const jobs = [
    { id: 'later', scheduled_at: '2026-09-07T06:00:00Z', technician_id: null, status: 'scheduled' },
    { id: 'current', scheduled_at: '2026-09-05T17:00:00Z', technician_id: 'driver-1', status: 'active' },
    { id: 'today', scheduled_at: '2026-09-06T06:00:00Z', technician_id: null, status: 'scheduled' },
    { id: 'stale', scheduled_at: '2026-09-04T06:00:00Z', technician_id: null, status: 'scheduled' },
  ];
  const result = organizeJobs(jobs, 'driver-1', new Date('2026-09-05T22:00:00Z'));
  assert.deepEqual(result.today.map((job) => job.id), ['current', 'today']);
  assert.deepEqual(result.upcoming.map((job) => job.id), ['later']);
  assert.equal(result.current?.id, 'current');
  assert.equal(jobs[0].id, 'later', 'presentation must not mutate server data');
  assert.equal(organizeJobs(jobs, 'driver-2').current, null, 'another driver’s work must not become mine');
});
