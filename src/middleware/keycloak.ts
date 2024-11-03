import Keycloak from "keycloak-connect";
import express from "express";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
}

const configBase64 = process.env.KEYCLOAK_ADAPTER_CONFIG;

if (!configBase64) {
  throw new Error("KEYCLOAK_ADAPTER_CONFIG is not in the environment!");
}

const config = JSON.parse(
  Buffer.from(configBase64, "base64").toString("utf-8")
);

const keycloak = new Keycloak({}, config);

const checkAuth = (
  req: any,
  res: express.Response,
  next: express.NextFunction
) => {
  keycloak.protect()(req, res, () => {
    // Get user information from the request
    const user = req.kauth.grant.access_token.content;
    req.user = user;

    next();
  });
};

export { keycloak, checkAuth };
