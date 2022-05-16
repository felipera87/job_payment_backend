import { Request, Response } from 'express';

import AppError from '@errors/AppError';

import GetContractsForProfileService from '@services/GetActiveContractsForProfileService';
import GetContractForProfileService from '@services/GetContractForProfileService';

import ContractRepository from '@repositories/contract/ContractRepository';

export default class ContractController {
  async index(req: Request, res: Response): Promise<Response> {
    const profileId = req.profile.id;

    const repository = new ContractRepository();
    const service = new GetContractsForProfileService(repository);

    const contracts = await service.execute(profileId);

    return res.json(contracts);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id: contractIdParam } = req.params;

    const contractId = parseInt(contractIdParam, 10);
    if (Number.isNaN(contractId)) {
      throw new AppError('Not a valid contract id.', 400);
    }

    const profileId = req.profile.id;

    const repository = new ContractRepository();
    const service = new GetContractForProfileService(repository);

    const contract = await service.execute(contractId, profileId);
    if (!contract) {
      throw new AppError(`Couldn't find contract (id: ${contractId}).`, 404);
    }

    return res.json(contract);
  }
}
