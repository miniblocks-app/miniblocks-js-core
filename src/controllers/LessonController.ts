import Lesson from "../models/Lesson";
import express from "express";
import mongoose from "mongoose";

async function saveLesson(req: express.Request, res: express.Response) {
  try {
    const id = req.params["id"];
    let uid = (req as any)?.user?.sub;

    const lesson = await Lesson.findOne({
      _id: new mongoose.Types.ObjectId(id),
      uid,
    });
    const request = req.body;

    if (!lesson) {
      res.sendStatus(404);

      return;
    }

    lesson.steps = request.steps;
    await lesson.save();
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function getLessonById(req: express.Request, res: express.Response) {
  try {
    const id = req.params["id"];
    let uid = (req as any)?.user?.sub;

    let doc = await Lesson.findOne({
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

async function newLesson(req: express.Request, res: express.Response) {
  try {
    let uid = (req as any)?.user?.sub;

    console.log({ ...req.body, uid });
    let lesson = new Lesson({ ...req.body, uid });
    await lesson.save();

    res.json(lesson);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function getAllLesson(req: express.Request, res: express.Response) {
  try {
    let uid = (req as any)?.user?.sub;
    let docs = await Lesson.find({ uid });

    res.json({
      result: docs,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function deleteLesson(req: express.Request, res: express.Response) {
  try {
    const id = req.params["id"];
    let uid = (req as any)?.user?.sub;

    await Lesson.deleteOne({
      uid,
      _id: new mongoose.Types.ObjectId(id),
    });

    res.sendStatus(200)
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

async function exploreLessons(req: express.Request, res: express.Response) {
  try {
    let docs = await Lesson.find(
      { public: true },
      { name: 1, desc: 1, variant: 1, _id: 1, steps: 1 }
    );

    res.json({
      result: docs,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

export { newLesson, saveLesson, getLessonById, getAllLesson, exploreLessons, deleteLesson };
