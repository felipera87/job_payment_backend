/* eslint-disable max-classes-per-file */
import Job from '@models/Job';
import Contract from '@models/Contract';
import Profile from '@models/Profile';

export class ContractWithProfiles extends Contract {
  Contractor: Profile;

  Client: Profile;
}

export class JobWithContract extends Job {
  Contract: ContractWithProfiles;
}

export class ProfessionValue {
  profession: string;

  total: number;
}

export class ClientValue {
  id: number;

  fullName: string;

  paid: number;
}
