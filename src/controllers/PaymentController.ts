import { Request, Response } from 'express';

import AppError from '@errors/AppError';

import PayJobForProfileService from '@services/PayJobForProfileService';

import JobRepository from '@repositories/job/JobRepository';
import ProfileRepository from '@repositories/profile/ProfileRepository';

export default class PaymentController {
  async create(req: Request, res: Response): Promise<Response> {
    const profileId = req.profile.id;
    const jobIdParam = req.params.id;

    const jobId = parseInt(jobIdParam, 10);
    if (Number.isNaN(jobId)) {
      throw new AppError('Not a valid job id.', 400);
    }

    const jobRepository = new JobRepository();
    const profileRepository = new ProfileRepository();
    const paymentService = new PayJobForProfileService(
      jobRepository,
      profileRepository,
    );

    await paymentService.execute(jobId, profileId);

    return res.end();
  }
}
