import { Router } from 'express';
import { SurveysController } from './database/controllers/SurveysController';
import { UserController } from './database/controllers/UserController';

const router = Router();

const userController = new UserController();
const serveysController = new SurveysController();


router.post('/users', userController.create);
router.post('/surveys', serveysController.create);
router.get('/surveys', serveysController.show);

export { router };