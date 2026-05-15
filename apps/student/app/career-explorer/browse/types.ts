import type { ICareerPath } from '@canvas/data/models/CareerPath';

/** Minimal career shape used by the browse grid. */
export interface BrowseCareer {
  _id: string;
  name: string;
  family: string;
  one_liner: string;
  hidden_gem: boolean;
  school_subjects: string[];
  evergreen_sector?: string;
  demand_trajectory: ICareerPath['demand_trajectory'];
}
