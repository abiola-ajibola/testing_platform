import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Role } from "../constants";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    if (req.session.user.role === Role.ADMIN) {
      next();
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: ReasonPhrases.UNAUTHORIZED });
    }
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  }
}
