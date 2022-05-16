import IContractRepository from '@repositories/contract/IContractRepository';
import Contract from '@models/Contract';

export default class GetContractForProfileService {
  constructor(private repository: IContractRepository) {}

  async execute(contractId: number, profileId: number): Promise<Contract> {
    return this.repository.findByIdForProfile(contractId, profileId);
  }
}
