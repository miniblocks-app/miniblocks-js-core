export class SandboxNotFound extends Error {
  constructor(name: string) {
    let message = `Sandbox with name ${name} does not exist.`;
    super(message);

    this.message = message;
    this.name = "SandboxNotFound";
    Error.captureStackTrace(this, SandboxNotFound);
  }
}
