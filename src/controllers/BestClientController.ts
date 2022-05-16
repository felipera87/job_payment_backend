import { Request, Response } from 'express';
import * as Yup from 'yup';
import { parseISO, isValid } from 'date-fns';

import AppError from '@errors/AppError';

import ProfileRepository from '@repositories/profile/ProfileRepository';
import GetBestClientsService from '@services/GetBestClientsService';

import getValidationErrors from 'utils/getValidationErrors';
import handleDateRange from 'utils/handleDateRange';

export default class BestClientsController {
  async index(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      start: Yup.string().test({
        name: 'start',
        message: 'Could not parse this date.',
        test: date => {
          if (date) {
            return isValid(parseISO(date));
          }
          return true;
        },
      }),
      end: Yup.string().test({
        name: 'end',
        message: 'Could not parse this date.',
        test: date => {
          if (date) {
            return isValid(parseISO(date));
          }
          return true;
        },
      }),
      limit: Yup.number().positive('Must be positive.'),
    });

    try {
      await schema.validate(req.query, {
        abortEarly: false,
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        throw new AppError('Invalid input.', 400, errors);
      }
    }

    const { start, end, limit: limitParam } = req.query;
    const limit = parseInt(limitParam as string, 10);

    const { startDate, endDate } = handleDateRange({
      startDate: start as string,
      endDate: end as string,
    });

    const repository = new ProfileRepository();
    const service = new GetBestClientsService(repository);

    const bestClients = await service.execute({ startDate, endDate, limit });

    if (bestClients.length === 0) {
      throw new AppError("There's no paid jobs for this time range.", 404);
    }

    return res.json(bestClients);
  }
}
