import Profile from '@models/Profile';

import { ProfessionValue, ClientValue } from '../types';

export default interface IProfileRepository {
  findById(id: number): Promise<Profile | null>;

  changeBalance(id: number, amount: number): Promise<void>;

  getTotalPaidValueByProfession({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ProfessionValue[]>;

  getTotalPaidValueByClient({
    startDate,
    endDate,
    limit,
  }: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ClientValue[]>;
}
