import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AnyObject, ObjectSchema } from "yup";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    console.log({ user: req.session });
    next();
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  }
}

type TValidateSchema<T extends AnyObject> = ObjectSchema<T, AnyObject, T, "">

export function validateSchema(schema: TValidateSchema<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body);
    } catch (e) {
      console.log({ e });
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: ReasonPhrases.BAD_REQUEST });
      return;
    }
    next();
  };
}
