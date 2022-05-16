import { Router } from 'express';

import ContractController from '@controllers/ContractController';
import UnpaidJobsController from '@controllers/UnpaidJobsController';
import PaymentController from '@controllers/PaymentController';
import DepositController from '@controllers/DepositController';
import BestProfessionController from '@controllers/BestProfessionController';
import BestClientController from '@controllers/BestClientController';

import getProfile from './middleware/getProfile';

const contractController = new ContractController();
const unpaidJobsController = new UnpaidJobsController();
const paymentController = new PaymentController();
const depositController = new DepositController();
const bestProfessionController = new BestProfessionController();
const bestClientController = new BestClientController();

const routes = Router();

routes.get('/contracts', getProfile, contractController.index);
routes.get('/contracts/:id', getProfile, contractController.show);

routes.get('/jobs/unpaid', getProfile, unpaidJobsController.index);
routes.post('/jobs/:id/pay', getProfile, paymentController.create);

routes.post('/balances/deposit/:id', depositController.create);

routes.get('/admin/best-profession', getProfile, bestProfessionController.show);

routes.get('/admin/best-clients', getProfile, bestClientController.index);

export default routes;
