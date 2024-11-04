import express, { Request, Response, NextFunction } from "express";

const app = express();
const port = process.env.PORT || 3001;

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  }
);

app
  .listen(port, () => {
    console.log(`Express server running on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Failed to start server:", err);
  });