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

declare module "express-session" {
  interface Session {
    user: {
      id: number;
      username: string;
      first_name: string;
      middle_name: string | null;
      last_name: string;
      password: null;
      role: string;
      createdAt: Date;
      lastModified: Date;
    } | null;
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
      secure: NODE_ENV !== "development",
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
  res.sendFile("index.html", { root: "frontend" });
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
