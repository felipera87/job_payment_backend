import {
  TEXT as sequelizeText,
  BOOLEAN as sequelizeBoolean,
  DECIMAL as sequelizeDecimal,
  DATE as sequelizeDate,
  INTEGER as sequelizeInteger,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ForeignKey,
} from 'sequelize';

import sequelize from '.';

class Job extends Model<InferAttributes<Job>, InferCreationAttributes<Job>> {
  id: number;

  description: string;

  price: number;

  paid: boolean;

  paymentDate: string;

  ContractId: ForeignKey<number>;
}

Job.init(
  {
    id: {
      type: sequelizeInteger,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: sequelizeText,
      allowNull: false,
    },
    price: {
      type: sequelizeDecimal(12, 2),
      allowNull: false,
    },
    paid: {
      type: sequelizeBoolean,
      defaultValue: false,
    },
    paymentDate: {
      type: sequelizeDate,
    },
  },
  {
    sequelize,
    modelName: 'Job',
  },
);

export default Job;
