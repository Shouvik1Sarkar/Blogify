import { body } from "express-validator";

export function writeCommentValidation() {
  return [
    body("comment")
      .trim()
      .notEmpty()
      .withMessage("this field can not be empty"),
  ];
}
