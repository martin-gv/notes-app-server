exports.REQUEST_BODY_ERROR = {
  status: 400,
  message: "request body not an object"
};
exports.AUTH_ERROR = { status: 403, message: "not authorized" };
exports.NOT_FOUND = { status: 404, message: "no resource found" };
exports.EMPTY_REQUEST_BODY = { status: 422, message: "empty request body" };
