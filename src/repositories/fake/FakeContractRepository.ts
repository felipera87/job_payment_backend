import { ContractWithProfiles } from '@repositories/types';
import { CONTRACT_TERMINATED } from '@utils/constants';

import IContractRepository from '../contract/IContractRepository';

import { fakeContractWithProfiles } from './fakeData';

export default class FakeContractRepository implements IContractRepository {
  public contracts: Array<ContractWithProfiles> = [];

  constructor() {
    this.contracts = fakeContractWithProfiles();
  }

  async findByIdForProfile(
    contractId: number,
    profileId: number,
  ): Promise<ContractWithProfiles> {
    return new Promise(resolve => {
      const findContract = this.contracts.filter(
        contract =>
          contract.id === contractId &&
          (contract.ClientId === profileId ||
            contract.ContractorId === profileId),
      );
      const resultContract = findContract.length > 0 ? findContract[0] : null;
      resolve(resultContract);
    });
  }

  async findAllActiveForProfile(
    profileId: number,
  ): Promise<ContractWithProfiles[]> {
    return new Promise(resolve => {
      resolve(
        this.contracts.filter(
          contract =>
            contract.status !== CONTRACT_TERMINATED &&
            (contract.ClientId === profileId ||
              contract.ContractorId === profileId),
        ),
      );
    });
  }
}
