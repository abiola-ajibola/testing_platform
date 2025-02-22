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
import { getCount } from "../baseControllers";
import { isAdmin } from "../../middlewares/roles";
import { isAuthenticated } from "../../middlewares/auth";
import { divide, format as mathFormat, multiply } from "mathjs";

async function create(
  req: Request<object, object, ICreateQuestion>,
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
    const _question = await question.getOne(+req.params.id, false);
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
  req: Request<object, object, object, TGetallQuestionsQuery>,
  res: Response
) {
  try {
    const _question = await question.getMany({
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

async function getQuestionsBySubjectID(req: Request, res: Response) {
  try {
    const _questions = await question.getBySubjectId({
      subjectId: +req.params.subjectId,
    });
    if (_questions) {
      res.status(StatusCodes.OK).json({ data: _questions });
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

async function submitAnswers(
  req: Request<
    object,
    object,
    {
      answers: ({ questionId: number; optionId: number } | null)[];
      total: number;
    }
  >,
  res: Response
) {
  const answers = req.body.answers;
  const total = req.body.total;
  const questions = await question.getMany({
    ids: answers.filter((a) => Boolean(a)).map((a) => a!.questionId),
    omitCorrect: false,
  });
  const correctOptions = questions.questions.filter((q) =>
    answers.find(
      (a) =>
        q.id == a?.questionId &&
        q.options.find((o) => o.id === a?.optionId && o.correct)
    )
  );

  const score =
    mathFormat(multiply(divide(correctOptions.length, total), 100), {
      precision: 2,
    }) + "%";

  res.status(StatusCodes.OK).json({ score });
}

const getQuestionsCount = getCount(question.getCount);

const router = Router();
router.use(isAuthenticated);

router.post("/", isAdmin, validateBody(createQuestionValidationSchema), create);
router.get("/", isAdmin, validateQuery(getAllValidationSchema), getMany);
router.get("/count", isAdmin, getQuestionsCount);
router.post("/submit-answers", submitAnswers);
router.get("/subject/:subjectId", getQuestionsBySubjectID);
router.get("/:id", isAdmin, validateParams(idParamValidationSchema), getOne);
router.patch(
  "/:id",
  isAdmin,
  validateParams(idParamValidationSchema),
  validateBody(updateQuestionValidationSchema),
  updateOne
);
router.delete(
  "/:id",
  isAdmin,
  validateParams(idParamValidationSchema),
  deleteOne
);

export const questionRouter = router;
