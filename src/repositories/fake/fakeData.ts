import Contract from '@models/Contract';
import Job from '@models/Job';
import Profile from '@models/Profile';
import { ContractWithProfiles, JobWithContract } from '@repositories/types';

import {
  PROFILE_CLIENT,
  PROFILE_CONTRACTOR,
  CONTRACT_IN_PROGRESS,
  CONTRACT_NEW,
  CONTRACT_TERMINATED,
} from '@utils/constants';

export function fakeClient(): Array<Profile> {
  const client1 = new Profile();
  Object.assign(client1, {
    id: 1,
    firstName: 'client1',
    lastName: 'client1',
    profession: 'client1',
    balance: 15,
    type: PROFILE_CLIENT,
  });
  const client2 = new Profile();
  Object.assign(client2, {
    id: 2,
    firstName: 'client2',
    lastName: 'client2',
    profession: 'client2',
    balance: 20,
    type: PROFILE_CLIENT,
  });

  return [client1, client2];
}

export function fakeContractor(): Array<Profile> {
  const contractor1 = new Profile();
  Object.assign(contractor1, {
    id: 3,
    firstName: 'contractor1',
    lastName: 'contractor1',
    profession: 'contractor1',
    balance: 15,
    type: PROFILE_CONTRACTOR,
  });
  const contractor2 = new Profile();
  Object.assign(contractor2, {
    id: 4,
    firstName: 'contractor2',
    lastName: 'contractor2',
    profession: 'contractor2',
    balance: 20,
    type: PROFILE_CONTRACTOR,
  });

  return [contractor1, contractor2];
}

export function fakeContract(): Array<Contract> {
  const [client1, client2] = fakeClient();
  const [contractor1, contractor2] = fakeContractor();

  const contract1 = new Contract();
  Object.assign(contract1, {
    id: 1,
    terms: 'contract1',
    status: CONTRACT_NEW,
    ClientId: client1.id,
    ContractorId: contractor1.id,
  });

  const contract2 = new Contract();
  Object.assign(contract2, {
    id: 2,
    terms: 'contract2',
    status: CONTRACT_IN_PROGRESS,
    ClientId: client1.id,
    ContractorId: contractor1.id,
  });

  const contract3 = new Contract();
  Object.assign(contract3, {
    id: 3,
    terms: 'contract3',
    status: CONTRACT_TERMINATED,
    ClientId: client1.id,
    ContractorId: contractor1.id,
  });

  const contract4 = new Contract();
  Object.assign(contract4, {
    id: 4,
    terms: 'contract4',
    status: CONTRACT_NEW,
    ClientId: client2.id,
    ContractorId: contractor2.id,
  });

  return [contract1, contract2, contract3, contract4];
}

export function fakeJob(): Array<Job> {
  const [contract1, contract2, contract3, contract4] = fakeContract();

  const job1 = new Job();
  Object.assign(job1, {
    id: 1,
    description: 'job1',
    price: 10,
    paid: true,
    paymentDate: '2020-08-10T19:11:26.737Z',
    ContractId: contract1.id,
  });

  const job2 = new Job();
  Object.assign(job2, {
    id: 2,
    description: 'job2',
    price: 20,
    paid: true,
    paymentDate: '2020-08-11T19:11:26.737Z',
    ContractId: contract1.id,
  });

  const job3 = new Job();
  Object.assign(job3, {
    id: 3,
    description: 'job3',
    price: 5,
    paid: false,
    paymentDate: '2020-08-10T19:11:26.737Z',
    ContractId: contract1.id,
  });

  const job4 = new Job();
  Object.assign(job4, {
    id: 4,
    description: 'job4',
    price: 25,
    paid: true,
    paymentDate: '2020-08-12T19:11:26.737Z',
    ContractId: contract2.id,
  });

  const job5 = new Job();
  Object.assign(job5, {
    id: 5,
    description: 'job5',
    price: 30,
    paid: false,
    paymentDate: '2020-08-13T19:11:26.737Z',
    ContractId: contract3.id,
  });

  const job6 = new Job();
  Object.assign(job6, {
    id: 6,
    description: 'job6',
    price: 35,
    paid: true,
    paymentDate: '2020-08-13T19:11:26.737Z',
    ContractId: contract4.id,
  });

  const job7 = new Job();
  Object.assign(job7, {
    id: 7,
    description: 'job7',
    price: 3500,
    paid: false,
    paymentDate: '2020-08-13T19:11:26.737Z',
    ContractId: contract4.id,
  });

  return [job1, job2, job3, job4, job5, job6, job7];
}

export function fakeContractWithProfiles(): Array<ContractWithProfiles> {
  const clients = fakeClient();
  const contractors = fakeContractor();
  const contracts = fakeContract();

  return contracts.map(contract => {
    const client = clients.filter(
      profile => profile.id === contract.ClientId,
    )[0];
    const contractor = contractors.filter(
      profile => profile.id === contract.ContractorId,
    )[0];

    const contractWithProfile = new ContractWithProfiles();
    Object.assign(contractWithProfile, contract);
    contractWithProfile.Client = client;
    contractWithProfile.Contractor = contractor;

    return contractWithProfile;
  });
}

export function fakeJobWithContract(): Array<JobWithContract> {
  const jobs = fakeJob();
  const contracts = fakeContractWithProfiles();

  return jobs.map(job => {
    const jobContract = contracts.filter(
      contract => contract.id === job.ContractId,
    )[0];

    const jobWithContract = new JobWithContract();
    Object.assign(jobWithContract, job);
    jobWithContract.Contract = jobContract;

    return jobWithContract;
  });
}
