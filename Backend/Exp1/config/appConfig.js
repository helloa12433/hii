import express from "express";
import loggerMiddleware from "../middleware/loggerMiddleware.js";
import mainRoutes from "../routes/mainRoutes.js";

const setupApp = (app) => {
  app.use(express.json());

  // Global Middleware
  app.use(loggerMiddleware);

  // Mount Routes
  app.use("/", mainRoutes);
};

export default setupApp;
