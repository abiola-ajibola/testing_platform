import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { validateBody, validateParams, validateQuery } from "../../middlewares";
import { subject, TGetallSubjectsQuery } from "../../models/subject";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";
import {
  createSubjectValidationSchema,
  updateSubjectValidationSchema,
} from "../../utils/validation/subject";
import { getCount } from "../baseControllers";

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
      res.status(StatusCodes.OK).json({ data: _subject });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}
// Create a getMany controller function
async function getMany(
  req: Request<object, object, object, TGetallSubjectsQuery>,
  res: Response
) {
  const { name, description, classId, page, perPage }: TGetallSubjectsQuery = req.query;
  try {
    const classes = await subject.getAll({
      classId,
      description,
      name,
      page,
      perPage,
    });
    res.status(StatusCodes.OK).json({ data: classes });
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

const getSubjectsCount = getCount(subject.getCount);

const subjectRouter = Router();
subjectRouter.post("/", validateBody(createSubjectValidationSchema), create);
subjectRouter.get("/count", getSubjectsCount);
subjectRouter.get("/", validateQuery(updateSubjectValidationSchema), getMany);
subjectRouter.get("/:id", validateParams(idParamValidationSchema), getOne);
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
