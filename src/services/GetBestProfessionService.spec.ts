import FakeProfileRepository from '@repositories/fake/FakeProfileRepository';

import GetBestProfessionService from '@services/GetBestProfessionService';

let fakeProfileRepository: FakeProfileRepository;
let service: GetBestProfessionService;

describe('GetBestProfessionService', () => {
  beforeEach(() => {
    fakeProfileRepository = new FakeProfileRepository();
    service = new GetBestProfessionService(fakeProfileRepository);
  });

  it('should return the best profession', async () => {
    const bestProfession = await service.execute({});

    expect(bestProfession).toBeDefined();

    expect(bestProfession.profession).toBe('contractor2');
    expect(bestProfession.total).toBe(35);
  });

  it('should return null if no job was done on date range', async () => {
    const startDate = new Date();
    const bestProfession = await service.execute({ startDate });

    expect(bestProfession).toBeDefined();

    expect(bestProfession).toBeNull();
  });
});
