import { Request, Response, NextFunction } from 'express';

const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { Profile } = req.app.get('models');

  try {
    const profile = await Profile.findOne({
      where: { id: req.get('profile_id') || 0 },
    });
    if (!profile) return res.status(401).end();
    req.profile = profile;

    return next();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.status(500).end();
  }
};

export default getProfile;
