import { ContractWithProfiles } from '@repositories/types';

export default interface IContractRepository {
  findByIdForProfile(
    contractId: number,
    profileId: number,
  ): Promise<ContractWithProfiles | null>;

  findAllActiveForProfile(profileId: number): Promise<ContractWithProfiles[]>;
}
