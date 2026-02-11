import { body } from "express-validator";

function registrationValidation() {
  return [
    // Require either email or userName
    body().custom((value, { req }) => {
      const { email, userName } = req.body;

      if (!email?.trim() && !userName?.trim()) {
        throw new Error("Either email or userName is required");
      }

      return true;
    }),

    body("email").trim().optional().isEmail().withMessage("Email is invalid"),

    body("userName")
      .trim()
      .optional()
      .isLength({ min: 4 })
      .withMessage("UserName must contain at least 4 characters"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.",
      ),
  ];
}

export { registrationValidation };
