import FakeContractRepository from '@repositories/fake/FakeContractRepository';

import GetActiveContractsForProfileService from '@services/GetActiveContractsForProfileService';

let fakeContractRepository: FakeContractRepository;
let service: GetActiveContractsForProfileService;

describe('GetActiveContractsForProfileService', () => {
  beforeEach(() => {
    fakeContractRepository = new FakeContractRepository();
    service = new GetActiveContractsForProfileService(fakeContractRepository);
  });

  it('should return all active contracts for a provided profile', async () => {
    const profileId = 1;

    const resultContracts = await service.execute(profileId);

    expect(resultContracts).toBeInstanceOf(Array);
    expect(resultContracts.length).toBeGreaterThan(0);
  });
});
