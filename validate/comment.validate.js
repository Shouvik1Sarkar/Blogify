import { body } from "express-validator";

export function writeCommentValidation() {
  return [
    body("comment")
      .trim()
      .notEmpty()
      .withMessage("this field can not be empty"),
  ];
}
export function updateCommentValidation() {
  return [
    body("newComment")
      .trim()
      .notEmpty()
      .withMessage("this field can not be empty"),
  ];
}
