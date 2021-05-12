import Question from '../models/Question';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../utils/ErrorResponse';
import { questionRouter } from '../routes/questionRoutes';

export const addQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = new Question({
      text: req.body.text,
      answer: req.body.answer,
      hints: req.body.hints,
      keywords: req.body.keywords,
      level: req.body.level,
      region: req.body.region,
    });

    await question.save();

    res.status(201).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
  
};
export const editQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const question =  await Question.findByIdAndUpdate(req.params.questionid,req.body)
    


  

    res.status(201).send(question);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
}

export const getQuestionByRegionId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //@ts-ignore
    const questions = await Question.find({region: req.params.regionId})
    


  

    res.status(201).send(questions);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
}

export const submitQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const question = await Question.findById(req.params.questionid)
    question?.keywords.forEach(element => {
      
    });    


  

    res.status(201).send(questions);
  } catch (err) {
    return next(new ErrorResponse(err.name, err.code));
  }
}
