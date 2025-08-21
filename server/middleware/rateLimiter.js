const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

const gameLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 50, 
    message: 'Too many game requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    gameLimiter
}; 