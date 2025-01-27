import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { validateBody, validateParams } from "../../middlewares";
import { subject } from "../../models/subject";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";
import { createSubjectValidationSchema, updateSubjectValidationSchema } from "../../utils/validation/subject";

async function create(req: Request, res: Response) {
  try {
    const _subject = await subject.createOne(req.body);
    if (_subject) {
      res.status(StatusCodes.CREATED).json({ message: "Subject created" });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function getOne(req: Request, res: Response) {
  try {
    const _subject = await subject.getOne(+req.params.id);
    if (_subject) {
      res.status(StatusCodes.CREATED).json({ message: ReasonPhrases.CREATED});
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function updateOne(req: Request, res: Response) {
  try {
    const _subject = await subject.updateOne({
      ...req.body,
      id: +req.params.id,
    });
    if (_subject) {
      res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function deleteOne(req: Request, res: Response) {
  try {
    const _subject = await subject.deleteOne(+req.params.id);
    if (_subject) {
      res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

const subjectRouter = Router();
subjectRouter.post("/", validateBody(createSubjectValidationSchema), create);
subjectRouter.get(
  "/:id",
  validateParams(idParamValidationSchema),
  getOne
);
subjectRouter.patch(
  "/:id",
  validateParams(idParamValidationSchema),
  validateBody(updateSubjectValidationSchema),
  updateOne
);
subjectRouter.delete(
  "/:id",
  validateParams(idParamValidationSchema),
  deleteOne
);

export { subjectRouter };
