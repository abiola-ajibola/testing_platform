import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { validateBody, validateParams, validateQuery } from "../../middlewares";
import {
  createQuestionValidationSchema,
  getAllValidationSchema,
  updateQuestionValidationSchema,
} from "../../utils/validation/question";
import {
  ICreateQuestion,
  question,
  TGetallQuestionsQuery,
} from "../../models/question";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";

async function create(
  req: Request<Object, Object, ICreateQuestion>,
  res: Response
) {
  try {
    const _question = await question.createOne(req.body);
    if (_question) {
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
    const _question = await question.getOne(+req.params.id);
    if (_question) {
      res.status(StatusCodes.OK).json({ data: _question });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function getMany(
  req: Request<Object, Object, Object, TGetallQuestionsQuery>,
  res: Response
) {
  try {
    const _question = await question.getAll({
      ...req.query,
      subjectId: req.query.subjectId && +req.query.subjectId,
    });
    if (_question) {
      res.status(StatusCodes.OK).json({ data: _question });
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
    const _question = await question.updateOne({
      ...req.body,
      id: +req.params.id,
    });
    if (_question) {
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
    const _question = await question.deleteOne(+req.params.id);
    if (_question) {
      res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

const router = Router();
router.post("/", validateBody(createQuestionValidationSchema), create);
router.get("/", validateQuery(getAllValidationSchema), getMany);
router.get("/:id", validateParams(idParamValidationSchema), getOne);
router.patch(
  "/:id",
  validateParams(idParamValidationSchema),
  validateBody(updateQuestionValidationSchema),
  updateOne
);
router.delete("/:id", validateParams(idParamValidationSchema), deleteOne);

export const questionRouter = router;
