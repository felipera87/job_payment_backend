import { Request, Response } from 'express';

import * as Yup from 'yup';

import AppError from '@errors/AppError';

import JobRepository from '@repositories/job/JobRepository';
import ProfileRepository from '@repositories/profile/ProfileRepository';
import DepositAmountToUserService from '@services/DepositAmountToUserService';

import getValidationErrors from 'utils/getValidationErrors';

export default class DepositController {
  async create(req: Request, res: Response): Promise<Response> {
    const userIdParam = req.params.id;

    const userId = parseInt(userIdParam, 10);
    if (Number.isNaN(userId)) {
      throw new AppError('Not a valid user id.', 400);
    }

    const schema = Yup.object().shape({
      amount: Yup.number()
        .required('Required field.')
        .positive('Must be a positive number.'),
    });

    try {
      await schema.validate(req.body, {
        abortEarly: false,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        throw new AppError('Invalid input.', 400, errors);
      }
    }

    const { amount } = req.body;

    const jobRepository = new JobRepository();
    const profileRepository = new ProfileRepository();

    const service = new DepositAmountToUserService(
      jobRepository,
      profileRepository,
    );

    await service.execute(userId, amount);

    return res.end();
  }
}
