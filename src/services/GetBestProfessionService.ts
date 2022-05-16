import IProfileRepository from '@repositories/profile/IProfileRepository';
import { ProfessionValue } from '@repositories/types';

export default class GetBestProfessionService {
  constructor(private repository: IProfileRepository) {}

  async execute({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ProfessionValue | null> {
    const professions = await this.repository.getTotalPaidValueByProfession({
      startDate,
      endDate,
    });

    let bestProfession: ProfessionValue | null = null;
    if (professions.length > 0) {
      [bestProfession] = professions;
    }

    return bestProfession;
  }
}
