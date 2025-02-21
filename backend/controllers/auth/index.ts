import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { user } from "../../models/user";
import { comparePassword, hashPassword } from "../../utils/crypto/password";
import { isAuthenticated } from "../../middlewares/auth";
import {
  changePasswordValidationSchema,
  loginValidationSchema,
  signupValidationSchema,
} from "../../utils/validation/auth";
import { validateBody } from "../../middlewares";

async function signup(req: Request, res: Response) {
  try {
    const existingUser = await user.getByUsername(req.body.username);
    if (existingUser) {
      res.status(StatusCodes.CONFLICT).json({ message: "User already exists" });
      return;
    }
    const password = await hashPassword(req.body.password);
    const _user = await user.createOne({ ...req.body, password });
    // store user information in session
    req.session.user! = { ..._user, password: null };

    // save the session before sending response to ensure
    // session is saved before response is sent
    req.session.save(function (err) {
      if (err) {
        console.log({ err });
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
        return;
      }
    });
    res.status(StatusCodes.CREATED).json({ data: _user });
  } catch (e) {
    console.log({ e });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function login(req: Request, res: Response) {
  const _user = await user.getOneWithPassword(req.body.username);
  if (!_user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: ReasonPhrases.NOT_FOUND });
    return;
  }
  const passwordMatch = await comparePassword(
    req.body.password,
    _user.password
  );
  if (!passwordMatch) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
    return;
  }
  req.session.regenerate(function (err) {
    if (err) {
      console.log({ err });
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      return;
    }
    
    req.session.user = { ..._user, password: null };
    req.session.save(function (err) {
      if (err) {
        console.log({ err });
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
        return;
      }
    });
    res
      .status(StatusCodes.OK)
      .json({ data: { ..._user, password: undefined } });
  });
}

async function logout(req: Request, res: Response) {
  req.session.user = null;
  req.session.save(function (err) {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      return;
    }

    req.session.regenerate(function (err) {
      if (err) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
        return;
      }
      res.status(StatusCodes.NO_CONTENT).end();
    });
  });
}

async function changePassword(req: Request, res: Response) {
  const _user = await user.getOneWithPassword(req.body.username);
  if (!_user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: ReasonPhrases.NOT_FOUND });
    return;
  }
  const passwordMatch = await comparePassword(
    req.body.password,
    _user.password
  );
  if (!passwordMatch) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
    return;
  }
  try {
    const new_password = await hashPassword(req.body.new_password);
    await user.updateOne({
      id: _user.id,
      username: req.body.username,
      password: new_password,
    });
    res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK });
  } catch (e) {
    console.log({ e });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}

async function me(req: Request, res: Response) {
  res
    .status(StatusCodes.OK)
    .json({ data: { ...req.session.user, password: undefined } });
}

const authRouter = Router();
authRouter.patch(
  "/change-password",
  validateBody(changePasswordValidationSchema),
  changePassword
);
authRouter.post("/login", validateBody(loginValidationSchema), login);
authRouter.post("/signup", validateBody(signupValidationSchema), signup);
authRouter.get("/logout", isAuthenticated, logout);
authRouter.get("/me", isAuthenticated, me);

export { authRouter };
