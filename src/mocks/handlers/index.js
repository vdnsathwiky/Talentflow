
import { jobsHandlers } from './jobsHandlers';
import { candidatesHandlers } from './candidatesHandlers';
import { assessmentsHandlers } from './assessmentsHandlers';

export const handlers = [
  ...jobsHandlers,
  ...candidatesHandlers,
  ...assessmentsHandlers,
];