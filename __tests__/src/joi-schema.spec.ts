import Joi from "@hapi/joi";
import JoiSchema from "../../src/joi-schema";

describe("generate openapi schema objects from joi objects", () => {
  test("generates required", () => {
    const actual = JoiSchema.openApiSchemaObject(Joi.object({
      a: Joi.string().required(),
      b: Joi.string(),
    }));
    expect(actual).toEqual({
      type: "object",
      required: [
        "a",
      ],
      properties: {
        a: {
          type: "string",
        },
        b: {
          type: "string",
        },
      },
    });
  });
});
