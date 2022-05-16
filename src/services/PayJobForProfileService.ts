import IJobRepository from '@repositories/job/IJobRepository';

import AppError from '@errors/AppError';
import IProfileRepository from '@repositories/profile/IProfileRepository';

export default class GetUnpaidJobsForProfileService {
  constructor(
    private jobRepository: IJobRepository,
    private profileRepository: IProfileRepository,
  ) {}

  async execute(jobId: number, profileId: number): Promise<void> {
    const job = await this.jobRepository.findByIdForProfile(jobId, profileId);

    if (!job) {
      throw new AppError('Job not found.', 404);
    }

    const { price: jobPrice, paid } = job;

    if (paid) {
      throw new AppError('This job is already paid.', 400);
    }

    const {
      Contract: {
        Contractor: { id: contractorId, balance: contractorBalance },
        Client: { id: clientId, balance: clientBalance },
      },
    } = job;

    if (profileId !== clientId) {
      throw new AppError('Only client can pay jobs.', 400);
    }

    if (clientBalance < jobPrice) {
      throw new AppError(
        'Client balance is not enough to pay for this job.',
        400,
      );
    }

    this.profileRepository.changeBalance(clientId, clientBalance - jobPrice);
    this.profileRepository.changeBalance(
      contractorId,
      contractorBalance + jobPrice,
    );

    await this.jobRepository.changeJobPaymentStatus(jobId, true);
  }
}
