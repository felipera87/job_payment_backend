import { JobWithContract } from '@repositories/types';

export default interface IJobRepository {
  findAllUnpaidForProfile(profileId: number): Promise<JobWithContract[]>;

  findByIdForProfile(
    jobId: number,
    profileId: number,
  ): Promise<JobWithContract | null>;

  changeJobPaymentStatus(id: number, paid: boolean): Promise<void>;

  getTotalUnpaidValueForProfile(profileId: number): Promise<number>;
}
