import express from "express";
import { SandboxService } from "../services/SandboxService";
import proxy from "express-http-proxy";
import Sandbox from "../models/Sandbox";
import { SandboxItem } from "../sandbox/SandboxManager";

async function createNewSandbox(req: express.Request, res: express.Response) {
  try {
    let uid = (req as any)?.user?.sub;
    let container = await SandboxService.createNew(uid);

    delete container.container;

    res.json({
      sandbox: container,
      time: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ message: e?.toString() });
    console.error(e);
  }
}

async function getSandbox(req: express.Request, res: express.Response) {
  try {
    let cName = req.params.name;
    let uid = (req as any)?.user?.sub;

    let exists = await Sandbox.findOne({ containerId: cName, uid });

    if (!exists) {
      throw new Error(`Container with ${cName} doesn't exists.`);
    }

    let container = await SandboxService.getContainerByName(cName);

    delete container.container;

    res.json({
      sandbox: container,
      time: new Date().toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ message: e?.toString() });
    console.error(e);
  }
}

async function proxySandbox(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let cName = req.params.name;
    // let rPath = req.params.path;

    let container = await SandboxService.getContainerByName(cName);
    let url = await SandboxService.getContainerURL(container);

    let path = url.split("/").slice(3);
    path.push("proxy");
    path.push(req.params[0]);

    req.url = "/" + path.join("/");

    console.debug("Request proxy url", req.url);

    return proxy(url)(req, res, next);
  } catch (e) {
    res.status(500).json({ message: e?.toString() });
    console.error(e);
  }
}

async function updateCode(req: express.Request, res: express.Response) {
  try {
    let cName = req.params.name;
    let body = req.body;
    let uid = (req as any)?.user?.sub;

    let exists = await Sandbox.findOne({ containerId: cName, uid });

    if (!exists) {
      throw new Error(`Container with ${cName} doesn't exist for ${uid}.`);
    }

    let container = await SandboxService.getContainerByName(cName);

    await SandboxService.updateCode(container, body);

    res.sendStatus(200);
  } catch (e) {
    res.status(500).json({ message: e?.toString() });
    console.error(e);
  }
}

async function getAllSandbox(req: express.Request, res: express.Response) {
  try {
    let uid = (req as any)?.user?.sub;
    let containers = await Sandbox.find({ uid }).lean();

    if (!containers || containers.length === 0) {
      // throw new Error(`Containers doesn't exist for ${uid}.`);
      await SandboxService.createNew(uid)
      containers = await Sandbox.find({ uid }).lean();
    }

    const runningContainers = await SandboxService.getAllSandboxMap();
    console.log(runningContainers);
    const userContainers: SandboxItem[] = [];

    for (let i = 0; i < containers.length; i++) {
    console.log(containers[i].containerId);

      let c = runningContainers.get(containers[i].containerId)

      console.log(c)
      if(c) userContainers.push(c);
    }

    res.json({
      containers: userContainers,
    });
  } catch (e) {
    res.status(500).json({ message: e?.toString() });
    console.error(e);
  }
}

async function getLog(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let cName = req.params.name;
    // let rPath = req.params.path;
    console.log("pp");
    let container = await SandboxService.getContainerByName(cName);
    let url = await SandboxService.getContainerURL(container);

    let path = url.split("/").slice(3);
    path.push("log");

    req.url = "/" + path.join("/");

    return proxy(url)(req, res, next);
  } catch (e) {
    res.status(500).json({ message: e?.toString() });
    console.error(e);
  }
}
export {
  createNewSandbox,
  getSandbox,
  proxySandbox,
  updateCode,
  getAllSandbox,
  getLog,
};
