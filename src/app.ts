import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cookieParser());  //added for checking middleware cookie data extraction

app.use("/api/v1", IndexRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('basic route is working');
});


app.use(notFound);
app.use(globalErrorHandler);


export default app;