import IContractRepository from '@repositories/contract/IContractRepository';
import Contract from '@models/Contract';

export default class GetActiveContractsForProfileService {
  constructor(private repository: IContractRepository) {}

  async execute(profileId: number): Promise<Contract[]> {
    return this.repository.findAllActiveForProfile(profileId);
  }
}
