import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import uniqid from "uniqid";

// import fs from "fs";
import fs from "fs-extra";
import createHttpError from "http-errors";
import { checkReviewSchema, triggerBadRequest } from "./validator.js";
import { getProducts, writeProducts } from "../products/index.js";

const { NotFound, BadRequest, Anauthorised } = createHttpError;
const { readJSON, writeJSON } = fs;

const reviewsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "reviews.json"
);
export const getReviews = () => readJSON(reviewsJSONPath);
export const writeReviews = (reviews) => writeJSON(reviewsJSONPath, reviews);

const reviewsRouter = express.Router();

reviewsRouter.put(
  "/:productId/reviews",
  checkReviewSchema,
  triggerBadRequest,
  async (req, res, next) => {
    try {
      //   const reviews = await getReviews();
      const newReview = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: uniqid(),
      };
      console.log("These Is the body??????", newReview);
      const products = await getProducts();
      const index = products.findIndex(
        (product) => product._id === req.params.productId
      );
      if (index !== -1) {
        const outDatedProduct = products[index];

        const updatedProduct = {
          ...outDatedProduct,
          reviews: [
            {
              ...newReview,
            },
          ],
        };
        console.log(updatedProduct);

        products[index] = updatedProduct;
        await writeProducts(products);
      }

      //   reviews.push(newReview);
      //   await writeReviews(reviews);
      res.status(201).send("Review sent");
    } catch (error) {
      next(error);
    }
  }
);
// reviewsRouter.put(
//   "/:reviewId/reviews",

//   async (req, res, next) => {
//     try {
//       console.log(req.body);
//       const reviews = await getReviews();

//       // const outDatedReview= reviews.find(review => review._id === req.params.reviewId)
//       const index = reviews.findIndex(
//         (review) => review._id === req.params.reviewId
//       );
//       if (index !== -1) {
//         const outDatedReview = reviews[index];
//         const updateReview = {
//           ...outDatedReview,
//           ...req.body,

//           updatedAt: new Date(),
//         };
//         reviews[index] = updateReview;
//         await writeReviews(reviews);
//         res.status(200).send(updateReview);
//       } else {
//         next(NotFound(`Review with id ${req.params.reviewId} not found`));
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );
reviewsRouter.get(
  "/:productId/reviews/",

  async (req, res, next) => {
    try {
      const products = await getProducts();
      const foundReviews = products.find(
        (product) => product._id === req.params.productId
      );
      const reviews = foundReviews.reviews;

      res.status(200).send(reviews);
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.get(
  "/:productId/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const products = await getProducts();
      const foundProduct = products.find(
        (product) => product._id === req.params.productId
      );

      if (foundProduct) {
        const foundReview = foundProduct.reviews.find(
          (review) => review._id === req.params.reviewId
        );
        console.log(products);
        foundReview
          ? res.send(foundReview)
          : next(NotFound(`Review with id ${req.params.reviewId} not found`));
      }
    } catch (error) {
      next(error);
    }
  }
);
reviewsRouter.delete(
  "/:productId/reviews/:reviewId",

  async (req, res, next) => {
    try {
      const products = await getProducts();
      const index = products.findIndex(
        (product) => product._id === req.params.productId
      );
      if (index !== -1) {
        const outDatedProduct = products[index];
        const reviews = products[index].reviews;
        const reviewIndex = reviews.findIndex(
          (review) => review._id === req.params.reviewId
        );
        if (reviewIndex !== -1) {
          const outDatedReview = reviews[reviewIndex];
          const updateReview = {
            ...outDatedReview,
            ...req.body,

            updatedAt: new Date(),
          };
          reviews[reviewIndex] = updateReview;
          const updatedProduct = {
            ...outDatedProduct,
            reviews: { ...updateReview },
          };
          products[index] = updatedProduct;
          console.log(updatedProduct);
          await writeProducts(products);
          res.status(200).send(updatedProduct);
          //   console.log(products[0]);
        }
        // console.log(updatedProduct);
      }
    } catch (error) {
      next(error);
    }
  }
);
export default reviewsRouter;
