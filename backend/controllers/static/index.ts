import { Request, Response, Router, static as static_ } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { isAdmin } from "../../middlewares/roles";
import { isAuthenticated } from "../../middlewares/auth";
import { unlink } from "fs/promises";
import { randomUUID } from "crypto";
const uploadFile = multer({
  dest: "static/images/",
  storage: multer.diskStorage({
    destination: "static/images/",
    filename: (req, file, cb) => {
      const extension = file.originalname.split(".").pop();
      cb(null, `${randomUUID()}.${extension}`);
    },
  }),
}).single("file");

async function upload(req: Request, res: Response) {
  uploadFile(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log({ multerError: err });
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
    }
    console.log({ body: req.body, file: req.file });
    if (req.body?.currentName) {
      console.log("deleting file:", req.body.currentName);
      try {
        await unlink(`static/images/${req.body.currentName.split("/").pop()}`);
      } catch (e) {
        console.error({ unlinkError: e });
      }
    }
    res.status(StatusCodes.CREATED).json({
      filename: `${req.protocol}://${req.headers.host}/static/${req.file?.filename}`,
    });
  });
}

async function download(req: Request, res: Response) {
  console.log(req.params);
  res.sendFile(`images/${req.params.id}`, { root: "static" });
}

const staticRouter = Router();
staticRouter.use(static_("static"));
staticRouter.use(isAuthenticated);

staticRouter.get("/:id", download);
staticRouter.post("/upload", isAdmin, upload);

export { staticRouter };
