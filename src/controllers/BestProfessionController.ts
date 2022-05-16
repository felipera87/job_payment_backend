import { Request, Response } from 'express';
import * as Yup from 'yup';
import { parseISO, isValid } from 'date-fns';

import AppError from '@errors/AppError';

import ProfileRepository from '@repositories/profile/ProfileRepository';
import GetBestProfessionService from '@services/GetBestProfessionService';

import getValidationErrors from 'utils/getValidationErrors';
import handleDateRange from 'utils/handleDateRange';

export default class BestProfessionController {
  async show(req: Request, res: Response): Promise<Response> {
    const schema = Yup.object().shape({
      // used Yup.string instead of Yup.date because date in pure javascript
      // have unexpected behaviour, ex: accepts month 13, automatically converting
      // to the next possible date
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

    const { start, end } = req.query;

    const { startDate, endDate } = handleDateRange({
      startDate: start as string,
      endDate: end as string,
    });

    const repository = new ProfileRepository();
    const service = new GetBestProfessionService(repository);

    const bestProfession = await service.execute({ startDate, endDate });

    if (!bestProfession) {
      throw new AppError("There's no paid jobs for this time range.", 404);
    }

    return res.json(bestProfession);
  }
}
