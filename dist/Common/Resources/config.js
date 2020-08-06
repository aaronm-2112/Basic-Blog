"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// let path;
// switch (process.env.NODE_ENV) {
//   case "test":
//     path = `${__dirname}/../../.env.test`;
//     break;
//   case "production":
//     path = `${__dirname}/../../.env.production`;
//     break;
//   default:
//     path = `${__dirname}/../../.env.development`;
// }
// dotenv.config({ path: path });
exports.DB_HOST = process.env.DB_HOST;
exports.DB_PASS = process.env.DB_PASS;
