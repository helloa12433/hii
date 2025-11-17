import express from "express";
import { createUsers, transferMoney } from "../controllers/transferController.js";

const router = express.Router();

router.post("/create-users", createUsers);
router.post("/transfer", transferMoney);

export default router;
