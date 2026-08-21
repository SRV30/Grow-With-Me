export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

export const errorHandler = (error, _req, res, _next) => {
  const status = error.statusCode || (error.name === 'ValidationError' ? 400 : 500)
  const message = status === 500 ? 'Internal server error' : error.message

  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  }

  res.status(status).json({
    success: false,
    message,
  })
}
