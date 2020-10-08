"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.rateLimiterUsingThirdParty = express_rate_limit_1.default({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5000,
    message: 'You have exceeded 5000 requests in 24 hrs!',
    headers: true,
});
