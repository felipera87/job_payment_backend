import Contract from './Contract';
import Profile from './Profile';
import Job from './Job';

Contract.belongsTo(Profile, { as: 'Contractor' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);

Job.belongsTo(Contract);

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
