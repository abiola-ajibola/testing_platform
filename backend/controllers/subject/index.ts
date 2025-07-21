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
import { isAdmin } from "../../middlewares/roles";
import { isAuthenticated } from "../../middlewares/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

async function create(req: Request, res: Response) {
  try {
    const _subject = await subject.createOne(req.body);
    if (_subject) {
      res.status(StatusCodes.CREATED).json({ message: "Subject created" });
    }
  } catch (e) {
    const error = e as PrismaClientKnownRequestError;
    console.dir(e, { depth: 6 });
    if (
      error.code == "P2002" &&
      (error.meta?.target as string[]).includes("name")
    ) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        message:
          "A Subject with the name " +
          req.body.name +
          " already exists, please use another name.",
      });
      return;
    }
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

async function getMany(
  req: Request<object, object, object, TGetallSubjectsQuery>,
  res: Response
) {
  const { name, description, classId, page, perPage }: TGetallSubjectsQuery =
    req.query;
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

async function getUsersSubjects(req: Request, res: Response) {
  const user = req.session.user;
  console.log({ user });
  if (user) {
    try {
      const data = await subject.getByClassId({
        classId: user.classes?.[0]?.id,
      });
      res.status(StatusCodes.OK).json({ data });
    } catch (error) {
      console.log({ error });
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
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

subjectRouter.use(isAuthenticated);

subjectRouter.post(
  "/",
  isAdmin,
  validateBody(createSubjectValidationSchema),
  create
);

subjectRouter.get("/count", isAdmin, getSubjectsCount);
subjectRouter.get("/user", getUsersSubjects);

subjectRouter.get(
  "/",
  isAdmin,
  validateQuery(updateSubjectValidationSchema),
  getMany
);

subjectRouter.get(
  "/:id",
  isAdmin,
  validateParams(idParamValidationSchema),
  getOne
);

subjectRouter.patch(
  "/:id",
  isAdmin,
  validateParams(idParamValidationSchema),
  validateBody(updateSubjectValidationSchema),
  updateOne
);

subjectRouter.delete(
  "/:id",
  isAdmin,
  validateParams(idParamValidationSchema),
  deleteOne
);

export { subjectRouter };
