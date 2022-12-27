import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";
const reviewSchema = {
  comment: {
    in: ["body"],
    isString: {
      errorMessage: "comment is a mandatory field",
    },
  },
  productId: {
    in: ["body"],
    isString: {
      errorMessage: "productId is a mandatory field",
    },
  },
};
export const checkReviewSchema = checkSchema(reviewSchema);
export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Errors during product vslidation", {
        errorsList: errors.array(),
      })
    );
  } else {
    next();
  }
};
