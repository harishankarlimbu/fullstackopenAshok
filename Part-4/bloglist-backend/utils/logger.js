
const info = (...params) => {
  // Only log if not in test environment
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

// Error logger
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info,
  error
}
