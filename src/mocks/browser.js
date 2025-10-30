
import { setupWorker } from 'msw/browser'
import { candidatesHandlers } from "./handlers/candidatesHandlers";
import { assessmentsHandlers } from "./handlers/assessmentsHandlers";
import { jobsHandlers } from "./handlers/jobsHandlers";

// Combine all handlers
export const worker = setupWorker(
  ...candidatesHandlers,
  ...assessmentsHandlers,
  ...jobsHandlers
);

