import {
  INTEGER as sequelizeInteger,
  ENUM as sequelizeEnum,
  TEXT as sequelizeText,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ForeignKey,
} from 'sequelize';

import sequelize from '.';

class Contract extends Model<
  InferAttributes<Contract>,
  InferCreationAttributes<Contract>
> {
  id: number;

  terms: string;

  status: string;

  ClientId: ForeignKey<number>;

  ContractorId: ForeignKey<number>;
}

Contract.init(
  {
    id: {
      type: sequelizeInteger,
      primaryKey: true,
      autoIncrement: true,
    },
    terms: {
      type: sequelizeText,
      allowNull: false,
    },
    status: {
      type: sequelizeEnum('new', 'in_progress', 'terminated'),
    },
  },
  {
    sequelize,
    modelName: 'Contract',
  },
);

export default Contract;
