import FakeContractRepository from '@repositories/fake/FakeContractRepository';

import GetContractForProfileService from '@services/GetContractForProfileService';

let fakeContractRepository: FakeContractRepository;
let service: GetContractForProfileService;

describe('GetContractForProfileService', () => {
  beforeEach(() => {
    fakeContractRepository = new FakeContractRepository();
    service = new GetContractForProfileService(fakeContractRepository);
  });

  it('should return the contract providing the contract and profile id', async () => {
    const profileId = 1;
    const contractId = 1;

    const resultContract = await service.execute(contractId, profileId);

    expect(resultContract).toBeDefined();
    expect(resultContract.id).toBe(contractId);
  });

  it('should not return the contract from someone else', async () => {
    const profileId = 1;
    const contractId = 4;

    const resultContract = await service.execute(contractId, profileId);
    expect(resultContract).toBeNull();
  });
});
