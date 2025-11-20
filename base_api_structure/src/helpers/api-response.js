export const success = (response, message, data) => {
  response.status(200).json({
    data,
    message,
    error: false,
    success: true,
  });
};
export const badRequest = (response, message) => {
  response.status(400).json({
    message,
    error: true,
    success: false,
  });
};
export const internalServerError = (response, message) => {
  response.status(500).json({
    message,
    error: true,
    success: false,
  });
};
