import express from "express";
import { healthCheck } from "./controllers/HealthCheckController";
import Config from "./config";
import SandboxManager from "./sandbox/SandboxManager";
import { setInterval } from "timers";
import sandboxRouter from "./routes/SandboxRoutes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import projectRouter from "./routes/ProjectRoutes";
import cors from "cors";
import { keycloak, checkAuth } from "./middleware/keycloak";
import lessonRouter from "./routes/LessonRoutes";
import userRouter from "./routes/UserRoutes";

const app = express();

app.use(cors())
app.use(express.json())
app.use(bodyParser.text({ type: 'text/plain' }))
app.use(keycloak.middleware())

app.get("/health", healthCheck);
app.use("/api/v1/sandbox", checkAuth, sandboxRouter);
app.use("/api/v1/project", checkAuth, projectRouter);
app.use("/api/v1/lesson", checkAuth, lessonRouter);
app.use("/api/v1/users", userRouter);

setInterval(async () => SandboxManager.removeExpiredContainers().catch(console.error),60*60*60*1000)

mongoose.connect(Config.SANDBOXED_MONGODB);

app.listen(Config.PORT, () => {
    console.log("Server is listening on " + Config.PORT);
})