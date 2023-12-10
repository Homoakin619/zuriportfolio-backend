import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    swagger: "2.0",
    info: {
      title: "Zuri Portfolio End Point Documentation",
      version: "1.0.0",
      description: "API for Zuri Portfolio End Point Documentation",
    },
  },
  apis: ["../routes/*.route.ts"],
};

export const specs = swaggerJsdoc(options);


