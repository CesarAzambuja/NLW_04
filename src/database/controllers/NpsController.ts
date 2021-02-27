import { getCustomRepository, Not, IsNull  } from "typeorm";
import { SurveysUsersRepository} from "../../repositories/SurveysUsersRepository";
import { Request, Response } from "express";


/**
          1 2 3 4 5 6 7 8 9 10
         Detratores => 0 - 6
         Passivos => 7 - 8   (Essas são desconsiderados)
         Promotores = > 9 - 10

         calculos  (P - D) / Nº de respostas * 100
         
**/

class NpsController {
    async execute(req: Request, res: Response){
        const { survey_id } = req.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id, 
            value: Not(IsNull()),
        });

        const detractors = surveysUsers.filter(
            (survey) => survey.value >=0 && survey.value <= 6).length;

            const passive = surveysUsers.filter(
                (survey) => survey.value >=7 && survey.value <=8
            ).length;   

        const promotors = surveysUsers.filter(
            (survey) => survey.value >=9
        ).length;

        const totalAnswers  = surveysUsers.length;

        const calculate = Number((((promotors - detractors) / totalAnswers)*100).toFixed(2));

       

        return res.json({
            detractors,
            passive, 
            promotors, 
            totalAnswers,
            nps: calculate,
        });
    };
};

export { NpsController }