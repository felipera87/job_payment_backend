import Profile from '@models/Profile';
import IProfileRepository from '@repositories/profile/IProfileRepository';
import {
  ProfessionValue,
  ClientValue,
  JobWithContract,
} from '@repositories/types';
import { parseISO, isBefore, isAfter } from 'date-fns';
import { fakeClient, fakeContractor, fakeJobWithContract } from './fakeData';

export default class FakeProfileRepository implements IProfileRepository {
  public profiles: Array<Profile>;

  public jobs: Array<JobWithContract>;

  constructor() {
    this.profiles = [...fakeClient(), ...fakeContractor()];
    this.jobs = fakeJobWithContract();
  }

  async findById(id: number): Promise<Profile> {
    return new Promise(resolve => {
      const findProfile = this.profiles.filter(profile => profile.id === id);
      const resultProfile = findProfile.length > 0 ? findProfile[0] : null;
      resolve(resultProfile);
    });
  }

  async changeBalance(id: number, amount: number): Promise<void> {
    const findProfile = this.profiles.filter(profile => profile.id === id);
    const profile = findProfile.length > 0 ? findProfile[0] : null;
    if (profile) {
      profile.balance = amount;
    }
  }

  async getTotalPaidValueByProfession({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<ProfessionValue[]> {
    const jobs = this.jobs.filter(job => {
      const paymentDate = parseISO(job.paymentDate);
      let isWithinRange = true;
      if (startDate) {
        isWithinRange = isAfter(paymentDate, startDate);
      }
      if (endDate) {
        isWithinRange = isWithinRange && isBefore(paymentDate, endDate);
      }
      return job.paid && isWithinRange;
    });

    const professionValues: { [key: string]: number } = {};
    jobs.forEach(job => {
      if (!professionValues[job.Contract.Contractor.profession]) {
        professionValues[job.Contract.Contractor.profession] = job.price;
      } else {
        professionValues[job.Contract.Contractor.profession] += job.price;
      }
    });

    const result = Object.keys(professionValues).map(professionName => {
      const professionValue = new ProfessionValue();
      professionValue.profession = professionName;
      professionValue.total = professionValues[professionName];
      return professionValue;
    });

    result.sort((prev, next) => prev.total - next.total);

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
    const jobs = this.jobs.filter(job => {
      const paymentDate = parseISO(job.paymentDate);
      let isWithinRange = true;
      if (startDate) {
        isWithinRange = isAfter(paymentDate, startDate);
      }
      if (endDate) {
        isWithinRange = isWithinRange && isBefore(paymentDate, endDate);
      }
      return job.paid && isWithinRange;
    });

    const clientValues: { [key: number]: { total: number; fullName: string } } =
      {};
    jobs.forEach(job => {
      if (!clientValues[job.Contract.Client.id]) {
        clientValues[job.Contract.Client.id] = {
          total: job.price,
          fullName: `${job.Contract.Client.firstName} ${job.Contract.Client.lastName}`,
        };
      } else {
        clientValues[job.Contract.Client.id].total += job.price;
      }
    });

    let result = Object.keys(clientValues).map(clientIdParam => {
      const clientId = parseInt(clientIdParam, 10);
      const clientValue = new ClientValue();
      clientValue.id = clientId;
      clientValue.fullName = clientValues[clientId].fullName;
      clientValue.paid = clientValues[clientId].total;
      return clientValue;
    });
    result.sort((prev, next) => prev.paid - next.paid);

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }
}
