import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../../errors/AppError';
import { SurveysUsersRepository } from '../../repositories/SurveysUsersRepository';

class AnswersController{

    // http://localhost:3333/answers/1?u=4ef0d338-77be-4838-84b7-73fbfe7b41e5
    // Route Params => Parametros que compoem a rota 
    // Como pegar ("/answers/:value/:id") 

    //  Query Params => Busca, Paginação (Não Obrigatorio)
    //vem depos da ? (Chave-valor....ex: ? u=4ef0d338-77be-4838-84b7-73fbfe7b41e5)

    async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { u } = req.query;

        const surveysUsersRepository= getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({ 
            id: String(u)
        });

        if(!surveyUser) {
            throw new AppError("Survey User does not exist")
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return res.json(surveyUser);
    }
}

export { AnswersController }

