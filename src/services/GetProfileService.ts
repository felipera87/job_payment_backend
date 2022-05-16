import IProfileRepository from '@repositories/profile/IProfileRepository';
import Profile from '@models/Profile';

export default class GetProfileService {
  constructor(private repository: IProfileRepository) {}

  async execute(id: number): Promise<Profile | null> {
    const profile = await this.repository.findById(id);
    return profile;
  }
}
