import express from "express";
import { checkAuth } from "../middleware/keycloak";
import { deleteLesson, exploreLessons, getAllLesson, getLessonById, newLesson, saveLesson } from "../controllers/LessonController";

const lessonRouter = express.Router();

lessonRouter.post("/new", checkAuth, newLesson);
lessonRouter.get("/explore", exploreLessons);
lessonRouter.get("/:id", checkAuth, getLessonById);
lessonRouter.delete("/:id", checkAuth, deleteLesson);
lessonRouter.post("/:id", checkAuth, saveLesson);
lessonRouter.get("/", checkAuth, getAllLesson);

export default lessonRouter;