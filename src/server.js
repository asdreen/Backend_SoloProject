import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/files/index.js";
import reviewsRouter from "./api/reviews/index.js";
import { join } from "path";
import {
  unauthorizedHandler,
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./errorhandlers.js";

const publicFolderPath = join(process.cwd());

const port = 3001;
const server = express();

server.use(express.json());
server.use(express.static(publicFolderPath));
server.use("/products", productsRouter);
server.use("/product", filesRouter);
server.use("/products", reviewsRouter);
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(unauthorizedHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
});
