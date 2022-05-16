import FakeProfileRepository from '@repositories/fake/FakeProfileRepository';

import GetProfileService from '@services/GetProfileService';

let fakeProfileRepository: FakeProfileRepository;
let service: GetProfileService;

describe('GetProfileService', () => {
  beforeEach(() => {
    fakeProfileRepository = new FakeProfileRepository();
    service = new GetProfileService(fakeProfileRepository);
  });

  it('should return the profile with the provided id', async () => {
    const profileId = 1;
    const resultProfile = await service.execute(profileId);

    expect(resultProfile).toBeDefined();
    expect(resultProfile.id).toBe(profileId);
  });

  it('should not return null if not found', async () => {
    const profileId = 999;

    const resultContract = await service.execute(profileId);
    expect(resultContract).toBeNull();
  });
});
