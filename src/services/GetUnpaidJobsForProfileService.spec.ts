import FakeJobRepository from '@repositories/fake/FakeJobRepository';

import GetUnpaidJobsForProfileService from '@services/GetUnpaidJobsForProfileService';

let fakeJobRepository: FakeJobRepository;
let service: GetUnpaidJobsForProfileService;

describe('GetUnpaidJobsForProfileService', () => {
  beforeEach(() => {
    fakeJobRepository = new FakeJobRepository();
    service = new GetUnpaidJobsForProfileService(fakeJobRepository);
  });

  it('should return all unpaid jobs for the provided id', async () => {
    const profileId = 1;
    const resultJobs = await service.execute(profileId);

    expect(resultJobs).toBeInstanceOf(Array);
    expect(resultJobs.length).toBeGreaterThan(0);
  });
});
