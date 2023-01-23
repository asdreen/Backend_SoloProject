import express from "express";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./api/products/index.js";
import filesRouter from "./api/files/index.js";
import reviewsRouter from "./api/reviews/index.js";
import cors from "cors";
import { join } from "path";
import {
  unauthorizedHandler,
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./errorhandlers.js";

const publicFolderPath = join(process.cwd());

const port = process.env.PORT;
const server = express();

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions = {
  origin: (origin, corsNext) => {
    console.log("-----CURRENT ORIGIN -----", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

server.use(cors(corsOptions));
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
  console.log("server is running on port:", port);
});
