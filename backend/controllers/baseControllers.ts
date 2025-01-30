import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export function getCount(getCount: () => Promise<{ count: number }>) {
  return async function (req: Request, res: Response) {
    try {
      const count = await getCount();
      res.status(StatusCodes.OK).json(count);
    } catch (error) {
      console.log({ error });
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  };
}
