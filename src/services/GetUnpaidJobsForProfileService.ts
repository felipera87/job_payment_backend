import IJobRepository from '@repositories/job/IJobRepository';
import { JobWithContract } from '@repositories/types';

export default class GetUnpaidJobsForProfileService {
  constructor(private repository: IJobRepository) {}

  async execute(profileId: number): Promise<JobWithContract[]> {
    return this.repository.findAllUnpaidForProfile(profileId);
  }
}
