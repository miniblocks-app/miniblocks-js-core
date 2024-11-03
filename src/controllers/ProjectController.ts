import express from "express";
import Project from "../models/Project";
import mongoose from "mongoose";
import _ from "lodash";

async function saveProject(req: express.Request, res: express.Response) {
  try {
    const id = req.params["id"];
    let uid = (req as any)?.user?.sub;

    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      uid,
    });
    const request = req.body;

    if (!project) {
      res.sendStatus(404);
      return;
    }

    project.saveData = request.code;

    if (project.mode == "lesson") {
      project.lessonStep = request.lessonStep ?? 0;
    }

    await project.save();
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function getProject(req: express.Request, res: express.Response) {
  try {
    const id = req.params["id"];
    let uid = (req as any)?.user?.sub;

    let doc = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      uid,
    });

    if (!doc) {
      res.sendStatus(404);
      return;
    }

    res.json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function getAllProjects(req: express.Request, res: express.Response) {
  try {
    let uid = (req as any)?.user?.sub;
    let docs = await Project.find({ uid }, { saveData: 0 });

    res.json({
      result: docs,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function newProject(req: express.Request, res: express.Response) {
  try {
    let uid = (req as any)?.user?.sub;

    console.log({ ...req.body, uid });
    let project = new Project({ ...req.body, uid });
    await project.save();

    res.json(project);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function deleteProject(req: express.Request, res: express.Response) {
  try {
    const id = req.params["id"];
    let uid = (req as any)?.user?.sub;

    await Project.deleteOne({
      uid,
      _id: new mongoose.Types.ObjectId(id),
    });

    res.sendStatus(200)
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function updateProject(req: express.Request, res: express.Response) {
  try {
    const id = req.params["id"];
    let uid = (req as any)?.user?.sub;
    const filter = _.pick(["name","desc"]);

    await Project.updateOne(
      { userId: uid, _id: new mongoose.Types.ObjectId(id) },
      filter
    );
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

export {
  saveProject,
  getProject,
  getAllProjects,
  newProject,
  deleteProject,
  updateProject,
};
