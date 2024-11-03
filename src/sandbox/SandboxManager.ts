import axios from "axios";
import Docker from "dockerode";
import { SandboxNotFound } from "../errors/SandboxErrors";
import Config from "../config";

type SandboxContainer = {
  name: string;
  id: string;
  container: any;
  port: string;
  host: string;
};

export type SandboxItem = {
  name: string,
  status: string
}

class SandboxManager {
  private static docker: Docker = new Docker();
  private static prefix = "sandbox-blockly-guest-";

  static async newSandbox(name: string, uid: string): Promise<SandboxContainer> {
    name = this.prefix + name;

    let container = await this.docker.createContainer({
      Image: "stargazerdocker/research-sandbox:latest",
      Env: [
        `PORT=:80`,
        `MONGODB_URI=${Config.sandboxed_mongodb}`,
        `COLLECTION=${Config.sandboxed_collection}`,
        `UID=${uid}`,
      ],
      ExposedPorts: {
        "80/tcp": {},
      },
      name,
      HostConfig: {
        NetworkMode: "blockly-guest",
      },
      Labels: {
        "com.centurylinklabs.watchtower.enable":"true"
      }
    });

    await container.start();

    let res = await container.inspect();

    let port = "80";
    let host = res.NetworkSettings.Networks["blockly-guest"].IPAddress;

    // let host = res.NetworkSettings.Bridge;

    if (!port) {
      await container.remove();
      throw new Error("Port was undefined.");
    }

    return {
      id: container.id,
      name,
      container,
      port,
      host,
    };
  }

  static async getContainerByName(name: string): Promise<SandboxContainer> {
    const containerList = await this.docker.listContainers();
    const container = containerList.find((c) =>
      c.Names.find((cc) => cc.includes(name))
    );

    if (!container) {
      throw new SandboxNotFound(name);
    }

    const newContainer = this.docker.getContainer(container.Id);

    let res = await newContainer.inspect();
    let port = "80";
    let host = res.NetworkSettings.Networks["blockly-guest"].IPAddress;

    if (!port) {
      await newContainer.remove();
      throw new Error("Port was undefined.");
    }

    return {
      id: container.Id,
      name,
      container,
      port,
      host,
    };
  }

  static async removeExpiredContainers(noTime?: boolean) {
    const containerList = await this.docker.listContainers();
    const now = Math.floor(Date.now() / 1000);

    const containers = containerList.filter(
      (c) =>
        c.Names.find((cc) => cc.includes(this.prefix)) &&
        ((now - c.Created) / 60 >= 60 || noTime) // if over 60 minutes was running, kill it.
    );

    const aContainers = await Promise.all(
      containers.map((i) => this.docker.getContainer(i.Id))
    );

    await Promise.all(aContainers.map((c) => c.stop().then(() => c.remove())));
  }

  static async getContainerURL(container: SandboxContainer) {
    return `http://${container.host}:${container.port}/api/v1`;
  }

  static async startContainer(container: SandboxContainer) {
    const url = await this.getContainerURL(container);
    const u = url + "/run";
    const res = await axios.post(u);

    if (res.status == 200) {
      return;
    }

    throw new Error("Container start failed.");
  }

  static async updateCode(container: SandboxContainer, code: string) {
    const url = await this.getContainerURL(container);
    const u = url + "/code/index.js";

    const res = await axios.post(u, code);

    if (res.status == 200) {
      await this.startContainer(container);
      return;
    }

    throw new Error("Container update failed.");
  }

  static async getAllSandbox(): Promise<SandboxItem[]> {
    const containerList = await this.docker.listContainers();
    const containers = containerList.filter((c) =>
      c.Names.find((cc) => cc.includes(this.prefix))
    );

    let arr: SandboxItem[] = [];
    containers.forEach((c) => {
      const name = c.Names.find((cc) => cc.includes(this.prefix));

      if(!name) return;

      arr.push({
        name: name?.slice(1),
        status: c.Status,
      });
    });

    return arr;
  }

  static async getAllSandboxMap() {
    const containerList = await this.docker.listContainers();
    const containers = containerList.filter((c) =>
      c.Names.find((cc) => cc.includes(this.prefix))
    );

    let map = new Map<string, SandboxItem>();

    containers.forEach((c) => {
      const name = c.Names.find((cc) => cc.includes(this.prefix));

      if(!name) return;

      let cName = name?.slice(1)

      map.set(cName, {
        name: cName,
        status: c.Status,
      })
    });

    return map;
  }
}

export default SandboxManager;
export { SandboxContainer };
