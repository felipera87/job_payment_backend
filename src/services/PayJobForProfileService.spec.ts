import Profile from '@models/Profile';
import FakeJobRepository from '@repositories/fake/FakeJobRepository';
import FakeProfileRepository from '@repositories/fake/FakeProfileRepository';
import { JobWithContract } from '@repositories/types';

import PayJobForProfileService from '@services/PayJobForProfileService';

import AppError from '@errors/AppError';

let fakeJobRepository: FakeJobRepository;
let fakeProfileRepository: FakeProfileRepository;
let service: PayJobForProfileService;

function getClientContractorJob(jobId: number): {
  client: Profile;
  contractor: Profile;
  job: JobWithContract;
} {
  const job = fakeJobRepository.jobs.filter(
    jobParam => jobParam.id === jobId,
  )[0];

  const client = fakeProfileRepository.profiles.filter(
    profile => profile.id === job.Contract.ClientId,
  )[0];

  const contractor = fakeProfileRepository.profiles.filter(
    profile => profile.id === job.Contract.ContractorId,
  )[0];

  return { client, contractor, job };
}

describe('PayJobForProfileService', () => {
  beforeEach(() => {
    fakeJobRepository = new FakeJobRepository();
    fakeProfileRepository = new FakeProfileRepository();
    service = new PayJobForProfileService(
      fakeJobRepository,
      fakeProfileRepository,
    );
  });

  it('should pay a valid job', async () => {
    const profileId = 1;
    const jobId = 3;

    const { client, contractor, job } = getClientContractorJob(jobId);

    const clientBalanceBeforePayment = client.balance;
    const contractorBalanceBeforePayment = contractor.balance;
    const jobStatusBeforePayment = job.paid;
    const jobPrice = job.price;

    await service.execute(jobId, profileId);

    const clientBalanceAfterPayment = client.balance;
    const contractorBalanceAfterPayment = contractor.balance;
    const jobStatusAfterPayment = job.paid;

    expect(clientBalanceAfterPayment).toBe(
      clientBalanceBeforePayment - jobPrice,
    );
    expect(contractorBalanceAfterPayment).toBe(
      contractorBalanceBeforePayment + jobPrice,
    );
    expect(jobStatusBeforePayment).toBe(false);
    expect(jobStatusAfterPayment).toBe(true);
  });

  it('should throw an error if job is not found', async () => {
    const profileId = 1;
    const jobId = 999;

    await expect(service.execute(jobId, profileId)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should throw an error if attempt to pay for a job already paid', async () => {
    const profileId = 1;
    const jobId = 1;

    await expect(service.execute(jobId, profileId)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should throw an error if a contractor tries to pay for a job', async () => {
    const profileId = 3;
    const jobId = 3;

    await expect(service.execute(jobId, profileId)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it("should throw an error if a client don't have enough to pay for job", async () => {
    const profileId = 2;
    const jobId = 7;

    await expect(service.execute(jobId, profileId)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
