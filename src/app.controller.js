import path from "path";
import connectDB from "./DB/DB.connection.js";
import authController from "./Modules/Auth/auth.controller.js";
import userController from "./Modules/User/user.controller.js";
import postController from "./Modules/Post/post.controller.js";
import chatController from "./Modules/Chat/chat.controller.js";
import { globalErrorHandling } from "./utilis/error/error.js";
import helmet from "helmet";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import rateLimit from "express-rate-limit";
import { schema } from "./Modules/app.graph.js";
const limiter = rateLimit({
    limit: 2,
    windowMs: 2 * 60 * 1000,
    message: { err: "Rate Limit Reached" },
    statusCode: 429,
    legacyHeaders: true,
    standardHeaders: "draft-8",
});

const bootstrap = (app, express) => {
    app.use(cors());
    app.use(helmet());
    app.use("/Auth", limiter);
    // app.use('/uploads', express.static(path.resolve('./src/uploads')));
    app.use(express.json());
    app.use("/graphql", createHandler({ schema: schema }));
    app.get("/", (req, res) => res.send("Hello World!"));
    app.use("/Auth", authController);
        app.use("/User", userController);
    app.use("/Chat", chatController);
    app.use("/Post", postController);
    app.all("*", (res) => {
        return res.status(404).json({ message: "invalid routing" });
    });
    app.use(globalErrorHandling);
    connectDB();
};
export default bootstrap;