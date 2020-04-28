# express-joi-openapi

### Example Implementation

```
import * as expressJoiOpenapi from "express-joi-openapi";

const openapiServer = new expressJoiOpenapi.server(
    {
      openapi: "3.0.3",
      info: {
        title: "API v2",
        version: "0.0.1",
        termsOfService: "http://example.com/terms/",
        contact: {
          name: "API Support",
          url: "http://www.example.com/support",
          email: "support@example.com",
        },
        license: {
          name: "Apache 2.0",
          url: "https://www.apache.org/licenses/LICENSE-2.0.html",
        },
      },
      servers: [
        {
          url: "/v1",
        },
      ],
    },
    server.app
  );



openapiServer.route({
    description: "List categories",
    method: "get",
    path: "/v1/categories",
    handler: async (req, res) => {
      res.json(await Category.all({
        limit: query.limit,
        offset: query.offset,
      }));
    },
    validateQuery: {
      schema: joi.object().keys({
        limit: joi
          .number()
          .integer()
          .min(1)
          .max(100)
          .default(1)
          .optional(),
        offset: joi
          .number()
          .integer()
          .default(0)
          .optional(),
      }),
    }
  })
```
