import IProfileRepository from '@repositories/profile/IProfileRepository';
import { ClientValue } from '@repositories/types';
import { DEFAULT_LIMIT } from '@utils/constants';

export default class GetBestClientsService {
  constructor(private repository: IProfileRepository) {}

  async execute({
    startDate,
    endDate,
    limit: limitParam,
  }: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ClientValue[]> {
    const limit = limitParam || DEFAULT_LIMIT;

    const bestClients = await this.repository.getTotalPaidValueByClient({
      startDate,
      endDate,
      limit,
    });

    return bestClients;
  }
}
