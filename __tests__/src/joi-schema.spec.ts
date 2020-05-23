import Joi from "@hapi/joi";
import JoiSchema from "../../src/joi-schema";

describe("object schema", () => {
  test("generates required for joi required", () => {
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

describe("string schema", () => {
  test("generates enum for joi valid", () => {
    const actual = JoiSchema.openApiSchemaObject(Joi.object({a: Joi.string().valid("x", "y", "z")}));
    expect(actual).toEqual({
      type: "object",
      properties: {
        a: {
          type: "string",
          enum: ["x", "y", "z"],
        },
      },
    });
  });
});
