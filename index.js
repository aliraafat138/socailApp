import express from "express";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./src/config/.env.dev") });
import bootstrap from "./src/app.controller.js";
import { runIo } from "./src/Modules/Socket/socket.controller.js";
const app = express();
const port = process.env.PORT || 5000;
bootstrap(app, express);
const httpServer = app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);
runIo(httpServer);