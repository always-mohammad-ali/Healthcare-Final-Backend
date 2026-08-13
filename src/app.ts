import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors";
import { envVar } from "./app/config/env";
import { PaymentController } from "./app/module/payment/payment.controller";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`) );


app.post("/webhook", express.raw({type : "application/json"}), PaymentController.handleStripeWebhookEvent);

app.use(cors({
  origin : [envVar.BETTER_AUTH_URL, envVar.FRONTEND_URL, "http://localhost:3000", "http://localhost:5000"],
  credentials : true,
  methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders : ["Content-Type", "Authorization"]
}))

// Catch-all route handler for Better Auth
app.use("/api/auth", toNodeHandler(auth));

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