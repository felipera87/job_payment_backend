import { Request, Response } from 'express';

import GetUnpaidJobsForProfileService from '@services/GetUnpaidJobsForProfileService';

import JobRepository from '@repositories/job/JobRepository';

export default class UnpaidJobsController {
  async index(req: Request, res: Response): Promise<Response> {
    const profileId = req.profile.id;

    const repository = new JobRepository();
    const service = new GetUnpaidJobsForProfileService(repository);

    const jobs = await service.execute(profileId);

    return res.json(jobs);
  }
}
