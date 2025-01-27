import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { validateBody, validateParams } from "../../middlewares";
import {
  createClassValidationSchema,
  updateClassValidationSchema,
} from "../../utils/validation/class";
import { question } from "../../models/question";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";

async function create(req: Request, res: Response) {
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
router.post("/", validateBody(createClassValidationSchema), create);
router.get(
  "/:id",
  validateParams(idParamValidationSchema),
  getOne
);
router.patch(
  "/:id",
  validateParams(idParamValidationSchema),
  validateBody(updateClassValidationSchema),
  updateOne
);
router.delete(
  "/:id",
  validateParams(idParamValidationSchema),
  deleteOne
);

export const questionRouter = router
