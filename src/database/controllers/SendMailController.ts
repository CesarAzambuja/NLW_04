import { Request, Response } from 'express';
import { resolve } from "path";
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../../repositories/UsersRepository';
import { SurveysRepository } from '../../repositories/SurverysRepository';
import { SurveysUsersRepository } from '../../repositories/SurveysUsersRepository';
import SendMailService from '../../services/SendMailService';
import { AppError } from '../../errors/AppError';




class SendMailController{

    async execute(req: Request, res: Response){
        const { email, survey_id } = req.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveyUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({ email });

    
        if(!user) {
            throw new AppError("User does not exist");
    
        };

        const survey = await surveysRepository.findOne({id_surveys: survey_id});

        if(!survey) {
            throw new AppError("Survey does not exist");
    
        };

        const npsPath = resolve(__dirname, '../../', 'views', "emails", 'npsMail.hbs');


        const surveyUserAlreadyExists = await surveyUsersRepository.findOne({
            where: {user_id: user.id, value: null},
            relations: ["user", "survey"]
        });


        const variables = {
            name: user.name, 
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        };

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return res.json(surveyUserAlreadyExists);
        }
    

        //Salvar Informações na tabela surveysUsers
        const surveyUser = surveyUsersRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveyUsersRepository.save(surveyUser)
        variables.id = surveyUser.id;
        //Enviar e-mail para o usuário


        await SendMailService.execute(email, survey.title, variables, npsPath);

        return res.json(surveyUser)
    }

}

export { SendMailController }
