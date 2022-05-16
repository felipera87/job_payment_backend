import IJobRepository from '@repositories/job/IJobRepository';

import AppError from '@errors/AppError';
import IProfileRepository from '@repositories/profile/IProfileRepository';

export default class DepositAmountToUserService {
  constructor(
    private jobRepository: IJobRepository,
    private profileRepository: IProfileRepository,
  ) {}

  async execute(profileId: number, amount: number): Promise<void> {
    if (amount <= 0) {
      throw new AppError(
        'Amount to deposit must be positive and not zero.',
        400,
      );
    }

    const profile = await this.profileRepository.findById(profileId);

    if (!profile) {
      throw new AppError('Profile not found', 400);
    }

    if (profile.type === 'contractor') {
      throw new AppError("You can't deposit for a contractor.", 400);
    }

    const unpaidValue = await this.jobRepository.getTotalUnpaidValueForProfile(
      profileId,
    );

    const depositLimit = unpaidValue * 0.25;

    if (amount > depositLimit) {
      throw new AppError(
        `Amount to deposit must be less than the limit for this user: ${depositLimit}`,
        400,
      );
    }

    const depositAmount = profile.balance + amount;
    await this.profileRepository.changeBalance(profileId, depositAmount);
  }
}
