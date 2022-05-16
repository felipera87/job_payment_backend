import { Op } from 'sequelize';
import Contract from '@models/Contract';
import Profile from '@models/Profile';
import { ContractWithProfiles } from '@repositories/types';
import { CONTRACT_TERMINATED } from '@utils/constants';
import IContractRepository from './IContractRepository';

export default class ContractRepository implements IContractRepository {
  async findAllActiveForProfile(
    profileId: number,
  ): Promise<ContractWithProfiles[]> {
    const contracts = await Contract.findAll({
      where: {
        status: { [Op.ne]: CONTRACT_TERMINATED },
        [Op.or]: [
          { '$Contractor.id$': profileId },
          { '$Client.id$': profileId },
        ],
      },
      include: [
        {
          model: Profile,
          as: 'Contractor',
        },
        {
          model: Profile,
          as: 'Client',
        },
      ],
    });
    return contracts as ContractWithProfiles[];
  }

  async findByIdForProfile(
    contractId: number,
    profileId: number,
  ): Promise<ContractWithProfiles | null> {
    const contract = await Contract.findOne({
      where: {
        id: contractId,
        [Op.or]: [
          { '$Contractor.id$': profileId },
          { '$Client.id$': profileId },
        ],
      },
      include: [
        {
          model: Profile,
          as: 'Contractor',
        },
        {
          model: Profile,
          as: 'Client',
        },
      ],
    });
    return contract as ContractWithProfiles;
  }
}
