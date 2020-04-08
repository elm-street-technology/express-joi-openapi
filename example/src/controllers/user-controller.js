import joi from "@hapi/joi";
import faker from "faker";
import Openapi from "../openapi";

export function routes(server) {
  Openapi("v1").route({
    description: "Returns all users",
    method: "get",
    path: "/v1/user",
    tags: ["Users"],
    summary: "Returns all users",
    operationId: "users",
    handler: userHandler,
    validate: {
      query: joi.object().keys({
        limit: joi
          .number()
          .integer()
          .min(1)
          .max(100)
          .default(25)
          .example(1)
          .description("number of records to return"),
        offset: joi
          .number()
          .integer()
          .default(0)
          .optional(),
      }),
    },
    responses: {
      200: {
        description: "List of Users",
        content: {
          "application/json": {
            schema: joi.object({
              meta: joi.object({
                totoal: joi.number().integer(),
              }),
              data: joi.array().items(userSchema),
            }),
          },
        },
      },
    },
  });
  Openapi("v1").route({
    description: "Returns all users",
    method: "get",
    path: "/vA/user",
    tags: ["Users"],
    summary: "Returns all users",
    operationId: "users",
    deprecated: true,
    handler: userHandler,
    validate: {
      query: joi.object().keys({
        limit: joi
          .number()
          .integer()
          .min(1)
          .max(100)
          .default(25)
          .example(1)
          .description("number of records to return"),
        offset: joi
          .number()
          .integer()
          .default(0)
          .optional(),
      }),
    },
    responses: {
      200: {
        description: "List of Users",
        content: {
          "application/json": {
            schema: joi.object({
              meta: joi.object({
                totoal: joi.number().integer(),
              }),
              data: joi.array().items(userSchema),
            }),
          },
        },
      },
    },
  });
  server.app.get("/user", userHandler);
}

async function userHandler(req, res) {
  console.log("handler");
  const users = [];
  for (let i = 0; i < 20; i++) {
    users.push({
      id: i,
      name: faker.name.findName(),
      role: "",
      status: "",
      lastActive: faker.date.recent(),
      email: faker.internet.email(),
    });
  }
  return res.status(200).send({ meta: {}, data: users });
}

const userSchema = joi.object({
  id: joi.number().integer(),
  name: joi.string(),
  role: joi.string(),
  status: joi.string(),
  lastActive: joi.date(),
  activity: joi.object({
    newMatchesDelta: joi.number().integer(),
    viewedListingsDelta: joi.number().integer(),
    favoritedListingsDelta: joi.number().integer(),
    viewedListings: joi.number().integer(),
    favoritedListings: joi.number().integer(),
  }),
  source: joi.string(),
  email: joi.string().email(),
  phone: joi.string(),
  readyToBuyAfterIsoDateStr: joi.date(),
  hasSignedUpForWebsite: joi.boolean(),
});
