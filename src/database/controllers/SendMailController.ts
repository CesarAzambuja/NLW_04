import { Request, Response } from 'express';
import { resolve } from "path";
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../../repositories/UsersRepository';
import { SurveysRepository } from '../../repositories/SurverysRepository';
import { SurveysUsersRepository } from '../../repositories/SurveysUsersRepository';
import SendMailService from '../../services/SendMailService';




class SendMailController{

    async execute(req: Request, res: Response){
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });

        if(!user) {
            return res.status(400).json({
                error: "User does not exist",
            });
        }

        const survey = await surveysRepository.findOne({id_surveys: survey_id});

        if(!survey) {
            return res.status(400).json({
                error: "Survey does not exist",
            })
        };

        const variables = {
            name: user.name, 
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        };

        const npsPath = resolve(__dirname, '../../', 'views', "emails", 'npsMail.hbs');


        const surveyUserAlreadyExists = await surveyUsersRepository.findOne({
            where: [{user_id: user.id}, {value: null}],
            relations: ["user", "survey"]
        });

        if(surveyUserAlreadyExists){
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return res.json(surveyUserAlreadyExists);
        }
    

        //Salvar Informações na tabela surveysUsers
        const surveyUser = surveyUsersRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveyUsersRepository.save(surveyUser)
        //Enviar e-mail para o usuário


        await SendMailService.execute(email, survey.title, variables, npsPath);

        return res.json(surveyUser)
    }

}

export { SendMailController }
