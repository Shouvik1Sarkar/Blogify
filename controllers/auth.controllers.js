import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
export async function reigsterUser(req, res) {
  const { fullName, userName, email, password } = req.body;

  // if (
  //   [fullName, userName, email, password].some(
  //     (field) => !field || field?.trim() === "",
  //   )
  // ) {
  //   throw new ApiError(400, "All the credentials are required.");
  // }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User Already exists. LogIn ");
  }

  const user = await User.create({
    fullName,
    userName,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(400, "User not created ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Created Successfully"));
}
