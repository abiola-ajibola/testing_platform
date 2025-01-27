import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { validateBody, validateParams } from "../../middlewares";
import {
  createQuestionOptionValidationSchema, updateQuestionOptionValidationSchema
} from "../../utils/validation/question_option";
import { questionOption } from "../../models/question_option";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";

async function create(req: Request, res: Response) {
  try {
    const _questionOption = await questionOption.createOne(req.body);
    if (_questionOption) {
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
    const _questionOption = await questionOption.getOne(+req.params.id);
    if (_questionOption) {
      res.status(StatusCodes.CREATED).json({ message: ReasonPhrases.CREATED });
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
    const _questionOption = await questionOption.updateOne({
      ...req.body,
      id: +req.params.id,
    });
    if (_questionOption) {
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
    const _questionOption = await questionOption.deleteOne(+req.params.id);
    if (_questionOption) {
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
router.post("/", validateBody(createQuestionOptionValidationSchema), create);
router.get("/:id", validateParams(idParamValidationSchema), getOne);
router.patch(
  "/:id",
  validateParams(idParamValidationSchema),
  validateBody(updateQuestionOptionValidationSchema),
  updateOne
);
router.delete("/:id", validateParams(idParamValidationSchema), deleteOne);

export const question_optionRouter = router;
