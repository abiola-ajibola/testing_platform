import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";
import { config } from "dotenv";
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
import { networkInterfaces } from "os";
config({ path: ".env" });

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

const pgSession = connectPg(session);

const {
  PORT = "8000",
  SESSION_SECRET,
  NODE_ENV_BE,
  DATABASE_URL,
} = process.env;

const pool = new pg.Pool({ connectionString: DATABASE_URL });

console.log({ DATABASE_URL, SESSION_SECRET, NODE_ENV_BE });

const app = express();

app.use(
  session({
    secret: SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
      pool,
      tableName: "Session",
    }),
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
  if (NODE_ENV_BE === "development") {
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
  console.log(`\nServer is running on port ${PORT}\n\n`);
  const addresses = networkInterfaces();
  for (const key in addresses) {
    const address = addresses?.[key]?.find((addr) => addr.family === "IPv4");
    if (address?.address === "127.0.0.1") {
      console.log(
        `Go to http://${address.address}:${PORT} in your browser to view the app`
      );
    }
    if (address?.address && address?.address !== "127.0.0.1") {
      console.log(
        `Go to http://${address.address}:${PORT} on another device on your network to access the app`
      );
    }
  }
  console.log("\n\n");
});
