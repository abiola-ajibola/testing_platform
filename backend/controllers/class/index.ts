import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { classModel } from "../../models/class";
import { validateBody, validateParams, validateQuery } from "../../middlewares";
import {
  createClassValidationSchema,
  updateClassValidationSchema,
} from "../../utils/validation/class";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";

async function createClass(req: Request, res: Response) {
  try {
    const _class = await classModel.createOne(req.body);
    if (_class) {
      res.status(StatusCodes.CREATED).json({ message: "Class created" });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function getClass(req: Request, res: Response) {
  try {
    const _class = await classModel.getOne(+req.params.id);
    if (_class) {
      res.status(StatusCodes.CREATED).json({ message: "Class created" });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function updateClass(req: Request, res: Response) {
  try {
    const _class = await classModel.updateOne({
      ...req.body,
      id: +req.params.id,
    });
    if (_class) {
      res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function deleteClass(req: Request, res: Response) {
  try {
    const _class = await classModel.deleteOne(+req.params.id);
    if (_class) {
      res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

const classRouter = Router();
classRouter.post("/", validateBody(createClassValidationSchema), createClass);
classRouter.get(
  "/:id",
  validateParams(idParamValidationSchema),
  getClass
);
classRouter.patch(
  "/:id",
  validateParams(idParamValidationSchema),
  validateBody(updateClassValidationSchema),
  updateClass
);
classRouter.delete(
  "/:id",
  validateParams(idParamValidationSchema),
  deleteClass
);

export { classRouter };
