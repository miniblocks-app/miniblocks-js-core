import express from "express";
import axios from "axios";
import Config from "../config";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
}

async function userRegistration(req: express.Request, res: express.Response) {
  try {
    await createUser(req.body)
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

const getAdminToken = async () => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${Config.KEYCLOAK_ENDPOINT}/realms/master/protocol/openid-connect/token`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "client_credentials",
      client_id: "admin-cli",
      client_secret: Config.KEYCLOAK_ADMIN_CLIENT_SECRET,
    },
  };

  let data = await axios.request(config);

  return data.data.access_token;
};

const createUser = async (user: User) => {
  let token = await getAdminToken();

  let data = JSON.stringify({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    emailVerified: false,
    enabled: true,
    credentials: [
      {
        temporary: false,
        type: "password",
        value: user.password,
      },
    ],
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${Config.KEYCLOAK_ENDPOINT}/admin/realms/blockly/users`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  let response = await axios.request(config);

  if (response.status != 201)
    throw new Error("er: response status was " + response.status);
};

export { userRegistration, createUser };