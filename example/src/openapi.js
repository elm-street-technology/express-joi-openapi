import ExpressJoiOpenapi from "@elm-street-technology/express-joi-openapi";

let instances = {};
//ExpressOpenapi
export default function get(version) {
  if (instances[version]) {
    return instances[version];
  }
  throw new Error(`Expess Openapi version (${version}) does not exist`);
}

export function setup(server) {
  instances["v1"] = new ExpressJoiOpenapi.server(
    {
      openapi: "3.0.3",
      info: {
        title: "API v1",
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
          url: "https://localhost:8005/v1",
          description: "Development server",
        },
        {
          url: "https://localhost:8006/v1",
          description: "Production server",
        },
      ],
    },
    server.app
  );

  server.app.get("/v1/openapi.json", (req, res) => {
    res.send(instances["v1"].getDefinition());
  });
}
