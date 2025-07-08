import {Router} from "express";
import {authentication} from "../../middleWare/auth.middleware.js";
import {getChat} from "./service/chat.service.js";
const router = Router();
router.get("/:friendId", authentication(), getChat);
export default router;
