import { Router } from 'express';
import { SendMailController } from './database/controllers/SendMailController';
import { SurveysController } from './database/controllers/SurveysController';
import { UserController } from './database/controllers/UserController';
import { AnswersController } from './database/controllers/AnswerController';
import { NpsController } from './database/controllers/NpsController';

const router = Router();

const userController = new UserController();
const serveysController = new SurveysController();
const sendMailController = new SendMailController();
const answersController = new AnswersController();
const npsController = new NpsController();


router.post('/users', userController.create);
router.post('/surveys', serveysController.create);
router.get('/surveys', serveysController.show);
router.post('/sendMail', sendMailController.execute);
router.get('/answers/:value', answersController.execute);
router.get('/nps/:survey_id', npsController.execute);

export { router };