import rateLimit from 'express-rate-limit';

export const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 5000,
  message: 'You have exceeded 5000 requests in 24 hrs!',
  headers: true,
});