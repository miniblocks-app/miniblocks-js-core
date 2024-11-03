import mongoose from "mongoose";
import Sandbox from "../models/Sandbox";
import SandboxManager, { SandboxContainer } from "../sandbox/SandboxManager";
import { v4 } from "uuid";

class SandboxService {
  localhost = "localhost";

  static async createNew(userId: string): Promise<SandboxContainer> {
    let uuid = v4();
    let session = await mongoose.startSession();

    return session.withTransaction(async () => {
      let containerCount = await Sandbox.find({
        userId,
      });

      if (containerCount.length >= 3) {
        throw new Error("Too many containers.");
      }

      let sandbox = await SandboxManager.newSandbox(uuid, userId);

      let sandboxEntry = new Sandbox({
        stopped: true,
        uid: userId,
        containerId: sandbox.name,
      });

      await sandboxEntry.save({ session });
      return sandbox;
    });
  }

  static async getContainerById(containerId: string) {}

  static async getContainerByName(containerName: string) {
    return SandboxManager.getContainerByName(containerName);
  }

  static async getUserContainers(userId: string) {}

  static async getContainerURL(container: SandboxContainer): Promise<string> {
    return SandboxManager.getContainerURL(container);
  }

  static async startContainer(container: SandboxContainer) {
    return SandboxManager.startContainer(container);
  }

  static async updateCode(container: SandboxContainer, code: string) {
    return SandboxManager.updateCode(container, code);
  }

  static async getAllSandboxMap() {
    return SandboxManager.getAllSandboxMap();
  }
}

export { SandboxService };
