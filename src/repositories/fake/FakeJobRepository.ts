import IJobRepository from '@repositories/job/IJobRepository';
import { JobWithContract } from '@repositories/types';
import { fakeJobWithContract } from './fakeData';

export default class FakeJobRepository implements IJobRepository {
  public jobs: Array<JobWithContract>;

  constructor() {
    this.jobs = fakeJobWithContract();
  }

  async findAllUnpaidForProfile(profileId: number): Promise<JobWithContract[]> {
    return new Promise(resolve => {
      resolve(
        this.jobs.filter(
          job =>
            !job.paid &&
            (job.Contract.ClientId === profileId ||
              job.Contract.ContractorId === profileId),
        ),
      );
    });
  }

  async findByIdForProfile(
    jobId: number,
    profileId: number,
  ): Promise<JobWithContract> {
    return new Promise(resolve => {
      const findJob = this.jobs.filter(
        job =>
          job.id === jobId &&
          (job.Contract.ClientId === profileId ||
            job.Contract.ContractorId === profileId),
      );
      const resultJob = findJob.length > 0 ? findJob[0] : null;
      resolve(resultJob);
    });
  }

  async changeJobPaymentStatus(id: number, paid: boolean): Promise<void> {
    const findJob = this.jobs.filter(job => job.id === id);
    const job = findJob.length > 0 ? findJob[0] : null;
    if (job) {
      job.paid = paid;
    }
  }

  getTotalUnpaidValueForProfile(profileId: number): Promise<number> {
    return new Promise(resolve => {
      let totalValue = 0;
      const unpaidJobs = this.jobs.filter(
        job =>
          !job.paid &&
          (job.Contract.ClientId === profileId ||
            job.Contract.ContractorId === profileId),
      );

      if (unpaidJobs.length > 0) {
        totalValue = unpaidJobs
          .map(job => job.price)
          .reduce((aggr, next) => aggr + next);
      }

      resolve(totalValue);
    });
  }
}
