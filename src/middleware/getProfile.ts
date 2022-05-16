import { Request, Response, NextFunction } from 'express';

import AppError from '@errors/AppError';
import ProfileRepository from '@repositories/profile/ProfileRepository';
import GetProfileService from '@services/GetProfileService';

const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const repository = new ProfileRepository();
  const service = new GetProfileService(repository);

  const profileId = parseInt(req.get('profile_id'), 10);
  if (Number.isNaN(profileId)) {
    throw new AppError('Profile id invalid or not provided.', 401);
  }

  const profile = await service.execute(profileId);
  if (!profile) throw new AppError('Profile not found', 401);
  req.profile = profile;
  return next();
};

export default getProfile;
