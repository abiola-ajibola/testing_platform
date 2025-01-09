import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    next();
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  }
}
