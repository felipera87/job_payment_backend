import {
  STRING as sequelizeString,
  ENUM as sequelizeEnum,
  DECIMAL as sequelizeDecimal,
  INTEGER as sequelizeInteger,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '.';

class Profile extends Model<
  InferAttributes<Profile>,
  InferCreationAttributes<Profile>
> {
  id: number;

  firstName: string;

  lastName: string;

  profession: string;

  balance: number;

  type: string;
}

Profile.init(
  {
    id: {
      type: sequelizeInteger,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: sequelizeString,
      allowNull: false,
    },
    lastName: {
      type: sequelizeString,
      allowNull: false,
    },
    profession: {
      type: sequelizeString,
      allowNull: false,
    },
    balance: {
      type: sequelizeDecimal(12, 2),
    },
    type: {
      type: sequelizeEnum('client', 'contractor'),
    },
  },
  {
    sequelize,
    modelName: 'Profile',
  },
);

export default Profile;
