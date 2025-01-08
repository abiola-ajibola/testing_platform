import express, { Request, Response } from "express";
import cors from "cors";
import session, { Store } from "express-session";
import StoreInitiator from "connect-sqlite3";
import { authRouter } from "./controllers/auth";

declare module "express-session" {
  interface Session {
    user: any;
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
// app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
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
