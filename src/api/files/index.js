import express from "express";
import multer from "multer";
import { extname } from "path";
import { saveImgCover, getProducts, writeProducts } from "../products/index.js";

const filesRouter = express.Router();

// Post the image

filesRouter.post(
  "/:productId/upload",
  multer().single("imageUrl"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.productId + originalFileExtension;

      await saveImgCover(fileName, req.file.buffer);

      const url = `http://localhost:3001/img/products/${fileName}`;

      const products = await getProducts();
      console.log("we are the PRODUCTS **********************", products);

      const index = products.findIndex(
        (product) => product._id === req.params.productId
      );
      console.log(req.params.productId);
      if (index !== -1) {
        const outDatedProduct = products[index];

        // const product = { ...outDatedProduct, coverImg: url };
        const updatedProduct = {
          ...outDatedProduct,
          imageUrl: url,
          updatedAt: new Date(),
        };

        products[index] = updatedProduct;

        await writeProducts(products);
      }

      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/multiple",
  multer().array("imageUrl"),
  async (req, res, next) => {
    try {
      console.log("FILES:", req.files);
      await Promise.all(
        req.files.map((file) => saveImgCover(file.originalname, file.buffer))
      );
      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
