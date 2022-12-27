import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";
const productSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "name is a mandatory field",
    },
  },

  brand: {
    in: ["body"],
    isString: {
      errorMessage: "brand is a mandatory field",
    },
  },
  price: {
    in: ["body"],
    isInt: {
      errorMessage: "price is a mandatory field",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "category is a mandatery field",
    },
  },
};
export const checkProductSchema = checkSchema(productSchema);
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
