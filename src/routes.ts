import { Router } from 'express';
import { SendMailController } from './database/controllers/SendMailController';
import { SurveysController } from './database/controllers/SurveysController';
import { UserController } from './database/controllers/UserController';

const router = Router();

const userController = new UserController();
const serveysController = new SurveysController();

const sendMailController = new SendMailController();


router.post('/users', userController.create);
router.post('/surveys', serveysController.create);
router.get('/surveys', serveysController.show);

router.post('/sendMail', sendMailController.execute);

export { router };