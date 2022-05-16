import FakeJobRepository from '@repositories/fake/FakeJobRepository';
import FakeProfileRepository from '@repositories/fake/FakeProfileRepository';

import DepositAmountToUserService from '@services/DepositAmountToUserService';

import AppError from '@errors/AppError';
import { PROFILE_CONTRACTOR } from '@utils/constants';

let fakeJobRepository: FakeJobRepository;
let fakeProfileRepository: FakeProfileRepository;
let service: DepositAmountToUserService;

describe('DepositAmountToUserService', () => {
  beforeEach(() => {
    fakeProfileRepository = new FakeProfileRepository();
    fakeJobRepository = new FakeJobRepository();
    service = new DepositAmountToUserService(
      fakeJobRepository,
      fakeProfileRepository,
    );
  });

  it('should be able to deposit an amount (less than 25% of total unpaid)', async () => {
    const profileId = 1;
    const depositValue = 1;

    const profile = fakeProfileRepository.profiles.filter(
      profileParam => profileParam.id === profileId,
    )[0];

    const balanceBeforeDeposit = profile.balance;

    await service.execute(profileId, depositValue);

    expect(profile).toHaveProperty('balance');
    expect(profile.balance).toBe(balanceBeforeDeposit + depositValue);
  });

  it('should be forbidden to deposit a big amount (more than 25% of total unpaid)', async () => {
    const profileId = 1;

    const profile = fakeProfileRepository.profiles.filter(
      profileParam => profileParam.id === profileId,
    )[0];

    const balanceBeforeDeposit = profile.balance;

    const depositValue = profile.balance * 1.25;

    await expect(
      service.execute(profileId, depositValue),
    ).rejects.toBeInstanceOf(AppError);

    expect(profile).toHaveProperty('balance');
    expect(profile.balance).toBe(balanceBeforeDeposit);
  });

  it('should be forbidden to deposit a negative value', async () => {
    const profileId = 1;
    const depositValue = -1;

    const profile = fakeProfileRepository.profiles.filter(
      profileParam => profileParam.id === profileId,
    )[0];

    const balanceBeforeDeposit = profile.balance;

    await expect(
      service.execute(profileId, depositValue),
    ).rejects.toBeInstanceOf(AppError);

    expect(profile).toHaveProperty('balance');
    expect(profile.balance).toBe(balanceBeforeDeposit);
  });

  it('should be forbidden to deposit value zero', async () => {
    const profileId = 1;
    const depositValue = 0;

    const profile = fakeProfileRepository.profiles.filter(
      profileParam => profileParam.id === profileId,
    )[0];

    const balanceBeforeDeposit = profile.balance;

    await expect(
      service.execute(profileId, depositValue),
    ).rejects.toBeInstanceOf(AppError);

    expect(profile).toHaveProperty('balance');
    expect(profile.balance).toBe(balanceBeforeDeposit);
  });

  it('should be forbidden to unexistent profile', async () => {
    const profileId = 999;
    const depositValue = 1;

    await expect(
      service.execute(profileId, depositValue),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be forbidden to deposit directly to a contractor', async () => {
    const depositValue = 1;

    const profile = fakeProfileRepository.profiles.filter(
      profileParam => profileParam.type === PROFILE_CONTRACTOR,
    )[0];

    const profileId = profile.id;

    const balanceBeforeDeposit = profile.balance;

    await expect(
      service.execute(profileId, depositValue),
    ).rejects.toBeInstanceOf(AppError);

    expect(profile).toHaveProperty('balance');
    expect(profile.balance).toBe(balanceBeforeDeposit);
  });
});
