import { Op, fn as sequelizeFunction, col as sequelizeColumn } from 'sequelize';
import Job from '@models/Job';
import Contract from '@models/Contract';
import Profile from '@models/Profile';
import { JobWithContract } from '@repositories/types';
import { CONTRACT_TERMINATED } from '@utils/constants';
import IJobRepository from './IJobRepository';

export default class JobRepository implements IJobRepository {
  async findByIdForProfile(
    jobId: number,
    profileId: number,
  ): Promise<JobWithContract> {
    const job = await Job.findOne({
      where: {
        id: jobId,
        [Op.or]: [
          { '$Contract.Contractor.id$': profileId },
          { '$Contract.Client.id$': profileId },
        ],
      },
      include: [
        {
          model: Contract,
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
        },
      ],
    });
    return job as JobWithContract;
  }

  async changeJobPaymentStatus(id: number, paid: boolean): Promise<void> {
    await Job.update(
      { paid },
      {
        where: { id },
      },
    );
  }

  async findAllUnpaidForProfile(profileId: number): Promise<JobWithContract[]> {
    const jobs = await Job.findAll({
      where: {
        paid: false,
        '$Contract.status$': {
          [Op.ne]: CONTRACT_TERMINATED,
        },
        [Op.or]: [
          { '$Contract.Contractor.id$': profileId },
          { '$Contract.Client.id$': profileId },
        ],
      },
      include: [
        {
          model: Contract,
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
        },
      ],
    });
    return jobs as JobWithContract[];
  }

  async getTotalUnpaidValueForProfile(profileId: number): Promise<number> {
    const jobs = await Job.findAll({
      attributes: [
        [
          sequelizeFunction('SUM', sequelizeColumn('price')),
          'totalUnpaidValue',
        ],
      ],
      where: {
        paid: false,
        '$Contract.status$': {
          [Op.ne]: CONTRACT_TERMINATED,
        },
        [Op.or]: [
          { '$Contract.Contractor.id$': profileId },
          { '$Contract.Client.id$': profileId },
        ],
      },
      include: [
        {
          model: Contract,
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
        },
      ],
    });

    let totalValue = 0;
    if (jobs.length > 0) {
      totalValue = jobs
        .map(job => job.get('totalUnpaidValue') as number)
        .reduce((aggr, next) => aggr + next);
    }

    return totalValue;
  }
}
