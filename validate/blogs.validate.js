import { body } from "express-validator";

export function createBlogValidation() {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required")
      .bail()
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters")
      .bail()
      .isLength({ max: 50 })
      .withMessage("Title must be less than 50 characters"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Description must be less than 200 characters"),
  ];
}
