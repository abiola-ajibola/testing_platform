import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { classModel, TGetallClassesQuery } from "../../models/class";
import { validateBody, validateParams, validateQuery } from "../../middlewares";
import {
  createClassValidationSchema,
  updateClassQueryValidationSchema,
  updateClassValidationSchema,
} from "../../utils/validation/class";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";
import { isAuthenticated } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/roles";
import { getCount } from "../baseControllers";

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
      res.status(StatusCodes.OK).json({ data: _class });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function getMany(
  req: Request<object, object, object, TGetallClassesQuery>,
  res: Response
) {
  const { name, description, page, perPage }: TGetallClassesQuery = req.query;
  try {
    const classes = await classModel.getAll({
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

const getClassesCount = getCount(classModel.getCount);

const classRouter = Router();
classRouter.use(isAuthenticated, isAdmin);

classRouter.post("/", validateBody(createClassValidationSchema), createClass);
classRouter.get(
  "/count",
  validateQuery(updateClassQueryValidationSchema),
  getClassesCount
);
classRouter.get("/", validateParams(updateClassValidationSchema), getMany);
classRouter.get("/:id", validateParams(idParamValidationSchema), getClass);
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
