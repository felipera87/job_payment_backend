import { Op, fn as sequelizeFunction, col as sequelizeColumn } from 'sequelize';
import Profile from '@models/Profile';
import Contract from '@models/Contract';
import Job from '@models/Job';
import IProfileRepository from './IProfileRepository';

import { ProfessionValue, ClientValue } from '../types';

export default class ProfileRepository implements IProfileRepository {
  async changeBalance(id: number, amount: number): Promise<void> {
    await Profile.update(
      { balance: amount },
      {
        where: { id },
      },
    );
  }

  async findById(id: number): Promise<Profile | null> {
    const profile = await Profile.findByPk(id);
    return profile as Profile;
  }

  async getTotalPaidValueByProfession({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ProfessionValue[]> {
    let dateQueryCondition = {};

    if (startDate || endDate) {
      dateQueryCondition = {
        '$Contractor.Jobs.paymentDate$': {
          [Op.between]: [startDate, endDate],
        },
      };
    }

    const profiles = await Profile.findAll({
      attributes: [
        'profession',
        [sequelizeFunction('SUM', sequelizeColumn('price')), 'totalValue'],
      ],
      group: 'profession',
      order: [[sequelizeColumn('totalValue'), 'DESC']],
      where: {
        ...dateQueryCondition,
      },
      include: [
        {
          model: Contract,
          as: 'Contractor',
          include: [
            {
              model: Job,
              where: {
                paid: true,
              },
            },
          ],
        },
      ],
    });

    const result: ProfessionValue[] = profiles.map(profile => {
      const { profession } = profile;
      const total = profile.get('totalValue') as number;

      return {
        profession,
        total,
      };
    });

    return result;
  }

  async getTotalPaidValueByClient({
    startDate,
    endDate,
    limit,
  }: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ClientValue[]> {
    let dateQueryCondition = {};

    if (startDate || endDate) {
      dateQueryCondition = {
        '$Client.Jobs.paymentDate$': {
          [Op.between]: [startDate, endDate],
        },
      };
    }

    let limitCondition = {};
    if (limit) {
      limitCondition = {
        limit,
      };
    }

    const profiles = await Profile.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        [sequelizeFunction('SUM', sequelizeColumn('price')), 'totalValue'],
      ],
      group: ['Profile.id', 'firstName', 'lastName'],
      order: [[sequelizeColumn('totalValue'), 'DESC']],

      where: {
        ...dateQueryCondition,
      },
      ...limitCondition,
      include: [
        {
          model: Contract,
          as: 'Client',
          attributes: [],
          duplicating: false,
          include: [
            {
              model: Job,
              attributes: [],
              duplicating: false,
              where: {
                paid: true,
              },
            },
          ],
        },
      ],
    });

    const result: ClientValue[] = profiles.map(profile => {
      const { id, firstName, lastName } = profile;
      const paid = profile.get('totalValue') as number;

      return {
        id,
        fullName: `${firstName} ${lastName}`,
        paid,
      };
    });

    return result;
  }
}
