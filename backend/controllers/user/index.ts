import { Request, Response, Router } from "express";
import { TGetallUsersQuery, user } from "../../models/user";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { isAuthenticated } from "../../middlewares/auth";
import { isAdmin } from "../../middlewares/roles";
import {
  signupValidationSchema,
  updateUserValidationSchema,
} from "../../utils/validation/auth";
import { hashPassword } from "../../utils/crypto/password";
import { validateBody, validateQuery } from "../../middlewares";
import { getUsersValidationSchema } from "../../utils/validation/users";
import { getCount } from "../baseControllers";

async function addUser(req: Request, res: Response) {
  try {
    const password = await hashPassword(req.body.password);
    const newUser = await user.createOne({ ...req.body, password });
    if (newUser) {
      res.status(StatusCodes.CREATED).json({ message: "User created" });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function getUsers(
  req: Request<object, object, object, TGetallUsersQuery>,
  res: Response
) {
  const {
    first_name,
    last_name,
    middle_name,
    page,
    perPage,
    role,
    username,
  }: TGetallUsersQuery = req.query;
  console.log({
    first_name,
    last_name,
    middle_name,
    page,
    perPage,
    role,
    username,
  });
  try {
    const users = await user.getAll({
      first_name,
      last_name,
      middle_name,
      page: page ? +page : undefined,
      perPage: perPage ? +perPage : undefined,
      role,
      username,
    });
    res.status(StatusCodes.OK).json({ ...users });
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function getOneUser(req: Request, res: Response) {
  if (!req.params.id) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ReasonPhrases.BAD_REQUEST });
  }
  try {
    const _user = await user.getOne(+req.params.id);
    res.status(StatusCodes.OK).json({ data: _user });
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function updateUser(req: Request, res: Response) {
  if (!req.params.id) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ReasonPhrases.BAD_REQUEST });
  }
  try {
    const password = req.body.password
      ? await hashPassword(req.body.password)
      : null;
    const updatedUser = await user.updateOne(
      password
        ? { ...req.body, password, id: +req.params.id }
        : {
            ...req.body,
            id: +req.params.id,
          }
    );
    if (updatedUser) {
      res.status(StatusCodes.OK).json({ message: "User updated" });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function deleteUser(req: Request, res: Response) {
  if (!req.params.id) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: ReasonPhrases.BAD_REQUEST });
  }
  if (req.session.user?.id === +req.params.id) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Cannot delete self using this approach" });
    return;
  }
  try {
    const deletedUser = await user.deleteOne(+req.params.id);
    if (deletedUser) {
      res.status(StatusCodes.OK).json({ message: "User deleted" });
    }
  } catch (error) {
    console.log({ error });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

const getUsersCount = getCount(user.getCount);

const usersRouter = Router();

usersRouter.use(isAuthenticated, isAdmin);

usersRouter.post("/", validateBody(signupValidationSchema), addUser);
usersRouter.patch("/:id", updateUser);
usersRouter.get("/", validateQuery(getUsersValidationSchema), getUsers);
usersRouter.get("/count", getUsersCount);
usersRouter.get("/:id", getOneUser);
usersRouter.delete(
  "/:id",
  validateBody(updateUserValidationSchema),
  deleteUser
);

export { usersRouter };
