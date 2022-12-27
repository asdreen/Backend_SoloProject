import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";

// import fs from "fs";
import fs from "fs-extra";
import createHttpError from "http-errors";
import { checkProductSchema, triggerBadRequest } from "./validator.js";

const { NotFound, BadRequest, Anauthorised } = createHttpError;
const { readJSON, writeJSON, writeFile } = fs;

const productJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "products.json"
);
const publicFolderPath = join(process.cwd(), "./public/img/products");
export const getProducts = () => readJSON(productJSONPath);
export const writeProducts = (products) => writeJSON(productJSONPath, products);
export const saveImgCover = (fileName, content) =>
  writeFile(join(publicFolderPath, fileName), content);
const productsRouter = express.Router();

// Post

productsRouter.post(
  "/",
  checkProductSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const products = await getProducts();
      console.log(" THESE ARE THE PRODUCTS", products);
      const newProduct = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: uniqid(),
      };
      products.push(newProduct);
      await writeProducts(products);
      res.status(201).send({ _id: newProduct._id });
    } catch (error) {
      next(error);
    }
  }
);

// Get

productsRouter.get(
  "/",

  async (req, res, next) => {
    try {
      const products = await getProducts();

      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  }
);

// Get with ID

productsRouter.get(
  "/:productId",

  async (req, res, next) => {
    try {
      const products = await getProducts();
      const foundProduct = products.find(
        (product) => product._id === req.params.productId
      );
      foundProduct
        ? res.send(foundProduct)
        : next(NotFound(`Product with id ${req.params.productId} not found`));
    } catch (error) {
      next(error);
    }
  }
);

// Put

productsRouter.put(
  "/:productId",

  async (req, res, next) => {
    try {
      console.log(req.body);
      const products = await getProducts();

      // const outDatedProduct= products.find(product => product._id === req.params.productId)
      const index = products.findIndex(
        (product) => product._id === req.params.productId
      );
      if (index !== -1) {
        const outDatedProduct = products[index];
        const updateProduct = {
          ...outDatedProduct,
          ...req.body,

          updatedAt: new Date(),
        };
        products[index] = updateProduct;
        await writeProducts(products);
        res.status(200).send(updateProduct);
      } else {
        next(NotFound(`Product with id ${req.params.productId} not found`));
      }
    } catch (error) {
      next(error);
    }
  }
);

// Delete
productsRouter.delete(
  "/:productId",

  async (req, res, next) => {
    try {
      const products = await getProducts();
      const remainingProducts = products.filter(
        (product) => product._id !== req.params.productId
      );
      const foundProduct = products.find(
        (product) => product._id === req.params.productId
      );
      products.length !== remainingProducts
        ? (await writeProducts(remainingProducts), res.status(204).send())
        : next(NotFound(`Product with id ${req.params.productId} not found`));
    } catch (error) {
      next(error);
    }
  }
);
export default productsRouter;
