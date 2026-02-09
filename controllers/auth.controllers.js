export function reigsterUser(req, res) {
  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password].some(
      (field) => !field || field?.trim() === "",
    )
  ) {
    throw new Error("This is error.");
  }

  return res.send("This is it.");
}
