import express from "express";
import { deleteProject, getAllProjects, getProject, newProject, saveProject, updateProject } from "../controllers/ProjectController";
import { checkAuth } from "../middleware/keycloak";

const projectRouter = express.Router();

projectRouter.post("/new", checkAuth, newProject);
projectRouter.get("/:id", checkAuth, getProject);
projectRouter.post("/:id", checkAuth, saveProject);
projectRouter.get("/", checkAuth, getAllProjects);
projectRouter.delete("/:id", checkAuth, deleteProject);
projectRouter.patch("/:id", checkAuth, updateProject);

export default projectRouter;