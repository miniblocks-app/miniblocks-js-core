import express from "express";
import { createNewSandbox, getAllSandbox, getLog, getSandbox, proxySandbox, updateCode } from "../controllers/SandboxController";
const sandboxRouter = express.Router();

sandboxRouter.post("/", createNewSandbox);
sandboxRouter.get("/all", getAllSandbox);
sandboxRouter.get("/:name", getSandbox);
sandboxRouter.all("/:name/proxy/*", proxySandbox);
sandboxRouter.post("/:name", updateCode);
sandboxRouter.get("/:name/log", getLog);

export default sandboxRouter;