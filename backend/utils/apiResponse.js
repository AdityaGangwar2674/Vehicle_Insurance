/**
 * Standard API Response Helper
 * @param {boolean} success - Operation success status
 * @param {string} message - User-friendly message
 * @param {object} data - Main data payload
 * @param {number} statusCode - HTTP status code
 * @param {object} meta - Additional metadata (pagination, filters, etc.)
 */
const apiResponse = (res, success, message, data = {}, statusCode = 200, meta = {}) => {
  const icon = success ? "✅" : "❌";
  const logColor = success ? "\x1b[32m" : "\x1b[31m"; // Green or Red
  const reset = "\x1b[0m";

  console.log(`${logColor}[API-Response] ${icon} Message: ${message}${reset}`);

  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};

module.exports = apiResponse;
