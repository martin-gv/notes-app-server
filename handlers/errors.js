// Error handling middleware takes four arguments
// instead of the usual three. Passing in four arguments
// identifies it as an error handling middleware function.

// next() always calls the next middleware function unless
// it is passed anything (with one exception: the string 'route')
// in which case Express will skip any non-error handling
// middleware functions
function errorHandler(err, req, res, next) {
  return res.status(err.status || 500).json({
    error: {
      message: err.message || "Oops! Something went wrong."
    }
  });
}

module.exports = errorHandler;
