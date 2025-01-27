import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { validateBody, validateParams } from "../../middlewares";
import {
  createClassValidationSchema,
  updateClassValidationSchema,
} from "../../utils/validation/class";
import { test } from "../../models/test";
import { idParamValidationSchema } from "../../utils/validation/utilityValidations";

async function create(req: Request, res: Response) {
  try {
    const _test = await test.createOne(req.body);
    if (_test) {
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
    const _test = await test.getOne(+req.params.id);
    if (_test) {
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
    const _test = await test.updateOne({
      ...req.body,
      id: +req.params.id,
    });
    if (_test) {
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
    const _test = await test.deleteOne(+req.params.id);
    if (_test) {
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
router.get("/:id", validateParams(idParamValidationSchema), getOne);
router.patch(
  "/:id",
  validateParams(idParamValidationSchema),
  validateBody(updateClassValidationSchema),
  updateOne
);
router.delete("/:id", validateParams(idParamValidationSchema), deleteOne);

export const testRouter = router;
