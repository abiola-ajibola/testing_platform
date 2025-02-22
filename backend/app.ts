import express, { Request, Response } from "express";
import cors from "cors";
import session, { Store } from "express-session";
import StoreInitiator from "connect-sqlite3";
import { authRouter } from "./controllers/auth";
import { usersRouter } from "./controllers/user";
import { classRouter } from "./controllers/class";
import { questionRouter } from "./controllers/question";
import { question_optionRouter } from "./controllers/question_option";
import { subjectRouter } from "./controllers/subject";
import { testRouter } from "./controllers/test";
import { staticRouter } from "./controllers/static";
import { ICreateUser } from "./models/user";
import { access, constants } from "fs";

declare module "express-session" {
  interface Session {
    user:
      | ({
          id: number;
          password: null;
          classes?: {
            id: number;
            name: string;
            description: string;
            createdAt: Date;
            lastModified: Date;
          }[];
          role: string;
          createdAt: Date;
          lastModified: Date;
        } & Omit<ICreateUser, "password" | "_classes">)
      | null;
  }
}

const SQLiteStore = StoreInitiator(session);

const { PORT = "8000", SESSION_SECRET, NODE_ENV } = process.env;

const app = express();

app.use(
  session({
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: new SQLiteStore({ db: "sessions.db" }) as Store,
    name: "axis",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.static("static"));
// app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/class", classRouter);
app.use("/question", questionRouter);
app.use("/question_option", question_optionRouter);
app.use("/subject", subjectRouter);
app.use("/test", testRouter);
app.use("/static", staticRouter);

app.get("*", (req: Request, res: Response) => {
  if (NODE_ENV === "development") {
    res.sendFile("index.html", { root: "frontend" });
  }
  try {
    console.log(req.url);
    access(`frontend${req.url}`, constants.F_OK, (err) => {
      if (err) {
        console.log({ code: err.code, path: err.path });
        res.sendFile("index.html", { root: "frontend" });
        return;
      }
      res.sendFile(req.url, { root: "frontend" });
    });
  } catch (error) {
    console.log({ error });
  }
});

app.get("/ping", (req: Request, res: Response) => {
  res.send(`<html>
      <head>
      </head>
      <body>
        <div>
          Pong 🏓
        </div>
      </body>
    </html>`);
});

app.listen(parseInt(PORT), () => {
  console.log(`Server is running on port ${PORT}`);
});
