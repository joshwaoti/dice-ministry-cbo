import { cronJobs } from 'convex/server';
import { api } from './_generated/api';

const crons = cronJobs();

crons.interval('process student Clerk invitation queue', { minutes: 5 }, api.invitations.processQueue, {
  limit: 20,
});

export default crons;
