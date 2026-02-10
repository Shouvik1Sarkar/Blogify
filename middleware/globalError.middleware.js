function globalError(err, req, res, next) {
  const error = { ...err };

  try {
    return res.status(err.statusCode || 500).json({
      statusCode: err.statusCode || 500,
      message: err.message || "Server error",
      errors: err.errors || [],
      success: err.success,
      data: err.data,
    });
  } catch (error) {
    return next(error);
  }
}
export default globalError;
