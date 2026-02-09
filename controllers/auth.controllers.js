import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
export function reigsterUser(req, res) {
  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some(
      (field) => !field || field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All the credentials are required.");
  }

  return res.status(200).json(new ApiResponse(200, null, "This is it"));
}
