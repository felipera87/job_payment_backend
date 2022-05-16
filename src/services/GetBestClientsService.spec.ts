import FakeProfileRepository from '@repositories/fake/FakeProfileRepository';

import GetBestClientsService from '@services/GetBestClientsService';

let fakeProfileRepository: FakeProfileRepository;
let service: GetBestClientsService;

describe('GetBestClientsService', () => {
  beforeEach(() => {
    fakeProfileRepository = new FakeProfileRepository();
    service = new GetBestClientsService(fakeProfileRepository);
  });

  it('should return the 2 best clients when limit is not informed', async () => {
    const resultContracts = await service.execute({});

    expect(resultContracts).toBeInstanceOf(Array);
    expect(resultContracts.length).toBe(2);
  });

  it('should return the 1 clients when limit is 1', async () => {
    const resultContracts = await service.execute({ limit: 1 });

    expect(resultContracts).toBeInstanceOf(Array);
    expect(resultContracts.length).toBe(1);
  });
});
