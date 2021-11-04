const rateLimit = require("express-rate-limit");

const timeLimit = 1; // hours
const maxLimit = 500; // limit each IP to 100 requests per windowMs

// use express-rate-limit to generate a 1 hour, 100 request limiter
export const publicAPILimiter = rateLimit({
  windowMs: timeLimit * 60 * 60 * 1000,
  max: maxLimit,
  message: `You have reached the maximum PROBE public API request limit of ${maxLimit} per ${timeLimit} hour(s). Please try again later`,
});
